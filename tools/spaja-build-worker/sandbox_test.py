"""Real kernel checks, no mocks/skips. Unsupported hosts fail this suite."""
import json
from pathlib import Path
import signal
import subprocess
import unittest

COMPILER = str(Path(__file__).with_name('compiler.py').resolve())
PRELUDE = f"import os, socket, resource, runpy; module = runpy.run_path({COMPILER!r}); module['isolate'](); "


class SandboxTest(unittest.TestCase):
    def probe(self, code, timeout=5):
        return subprocess.run(['/usr/bin/python3', '-I', '-S', '-c', PRELUDE + code],
                              input=b'', capture_output=True, env={}, timeout=timeout)

    def test_filesystem_read_denied(self):
        result = self.probe("open('/etc/hostname').read()")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn(b'PermissionError', result.stderr)

    def test_filesystem_write_denied(self):
        result = self.probe("open('/tmp/spaja-forbidden-write', 'w')")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn(b'PermissionError', result.stderr)

    def test_network_denied(self):
        result = self.probe('socket.socket()')
        self.assertNotEqual(result.returncode, 0)
        self.assertIn(b'PermissionError', result.stderr)

    def test_process_creation_denied(self):
        result = self.probe('os.fork()')
        self.assertNotEqual(result.returncode, 0)
        self.assertIn(b'PermissionError', result.stderr)

    def test_execution_denied(self):
        result = self.probe("os.execv('/usr/bin/true', ['true'])")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn(b'PermissionError', result.stderr)

    def test_memory_limit(self):
        result = self.probe('bytearray(256 * 1024 * 1024)')
        self.assertNotEqual(result.returncode, 0)
        self.assertIn(b'MemoryError', result.stderr)

    def test_cpu_limit(self):
        result = self.probe('\nwhile True: pass')
        self.assertEqual(result.returncode, -signal.SIGKILL)

    def test_limits_cannot_be_raised(self):
        result = self.probe('resource.setrlimit(resource.RLIMIT_AS, (268435456, 268435456))')
        self.assertNotEqual(result.returncode, 0)

    def test_html_is_escaped_and_dependency_fields_rejected(self):
        base = {'schemaVersion': 1, 'title': '<script>', 'paragraphs': ['<img src=x onerror=alert(1)>']}
        result = subprocess.run(['/usr/bin/python3', '-I', '-S', COMPILER],
                                input=json.dumps(base).encode(), capture_output=True, env={})
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn(b'&lt;script&gt;', result.stdout)
        self.assertNotIn(b'<img', result.stdout)
        base['dependencies'] = ['forbidden']
        result = subprocess.run(['/usr/bin/python3', '-I', '-S', COMPILER],
                                input=json.dumps(base).encode(), capture_output=True, env={})
        self.assertEqual(result.returncode, 1)
        self.assertEqual(result.stdout, b'')

    def test_sandbox_setup_failure_never_compiles(self):
        code = (f"import runpy; m=runpy.run_path({COMPILER!r}); "
                "m['main'].__globals__['isolate'] = lambda: (_ for _ in ()).throw(RuntimeError('unavailable')); "
                "raise SystemExit(m['main']())")
        result = subprocess.run(['/usr/bin/python3', '-I', '-S', '-c', code],
                                input=b'{"schemaVersion":1,"title":"x","paragraphs":["x"]}',
                                capture_output=True, env={})
        self.assertEqual(result.returncode, 78)
        self.assertEqual(result.stdout, b'')
        self.assertEqual(result.stderr, b'sandbox-unavailable\n')

    def test_duplicate_keys_and_oversized_source_rejected(self):
        for data in (b'{"schemaVersion":1,"schemaVersion":1,"title":"x","paragraphs":["x"]}', b'x' * 16385):
            result = subprocess.run(['/usr/bin/python3', '-I', '-S', COMPILER], input=data, capture_output=True, env={})
            self.assertEqual(result.returncode, 1)
            self.assertEqual(result.stdout, b'')


if __name__ == '__main__':
    unittest.main()
