"""Execute the exact inline gate used by Actions, using only Python's stdlib."""
import json
import os
from pathlib import Path
import re
import subprocess
import textwrap
import unittest

ROOT = Path(__file__).resolve().parents[2]
WORKFLOW = (ROOT / '.github/workflows/application-validation.yml').read_text()
MATCHES = re.findall(r"          python3 - <<'PY_GATE'\n(.*?)          PY_GATE", WORKFLOW, re.S)
assert len(MATCHES) == 1, 'Expected one authoritative gate program'
PROGRAM = textwrap.dedent(MATCHES[0])
JOBS = ('quality', 'tests', 'build', 'browser')


class ApplicationGateTests(unittest.TestCase):
    def run_gate(self, value):
        env = dict(os.environ)
        if value is None:
            env.pop('NEEDS_JSON', None)
        else:
            env['NEEDS_JSON'] = value
        return subprocess.run(['python3', '-c', PROGRAM], env=env,
                              capture_output=True, text=True, check=False).returncode

    def successes(self):
        return {name: {'result': 'success'} for name in JOBS}

    def test_all_required_jobs_succeeded(self):
        self.assertEqual(self.run_gate(json.dumps(self.successes())), 0)

    def test_every_non_success_is_rejected_for_every_job(self):
        for name in JOBS:
            for state in ('failure', 'cancelled', 'skipped', 'neutral',
                          'timed_out', 'pending', '', None):
                with self.subTest(job=name, result=state):
                    results = self.successes()
                    results[name]['result'] = state
                    self.assertNotEqual(self.run_gate(json.dumps(results)), 0)

    def test_missing_or_malformed_job_is_rejected(self):
        for name in JOBS:
            with self.subTest(job=name):
                results = self.successes()
                del results[name]
                self.assertNotEqual(self.run_gate(json.dumps(results)), 0)
                for malformed in ({}, 'success', None, []):
                    results[name] = malformed
                    self.assertNotEqual(self.run_gate(json.dumps(results)), 0)

    def test_empty_invalid_or_missing_payload_is_rejected(self):
        for value in (None, '', '{', '{}', '[]', 'null', 'true', '"success"'):
            with self.subTest(value=value):
                self.assertNotEqual(self.run_gate(value), 0)

    def test_unexpected_job_requires_explicit_policy_update(self):
        results = self.successes()
        results['unknown'] = {'result': 'success'}
        self.assertNotEqual(self.run_gate(json.dumps(results)), 0)


class SecurityGateTests(unittest.TestCase):
    def run_gate(self, results, event='pull_request'):
        workflow = (ROOT / '.github/workflows/security-scanner.yml').read_text()
        programs = re.findall(r"          python3 - <<'PY_SECURITY_GATE'\n(.*?)          PY_SECURITY_GATE", workflow, re.S)
        self.assertEqual(len(programs), 1)
        env = dict(os.environ, NEEDS_JSON=json.dumps(results), VALIDATION_EVENT=event)
        return subprocess.run(['python3', '-c', textwrap.dedent(programs[0])],
                              env=env, capture_output=True, check=False).returncode

    def successes(self):
        return {name: {'result': 'success'} for name in
                ('dependency-review', 'secret-heuristics', 'npm-audit', 'codeql')}

    def test_pr_requires_all_four_successes(self):
        self.assertEqual(self.run_gate(self.successes()), 0)
        for name in self.successes():
            for state in ('skipped', 'neutral', 'failure', 'cancelled', None):
                with self.subTest(job=name, state=state):
                    results = self.successes()
                    results[name]['result'] = state
                    self.assertNotEqual(self.run_gate(results), 0)

    def test_non_pr_skips_only_dependency_review(self):
        for event in ('push', 'schedule', 'workflow_dispatch'):
            results = self.successes()
            results['dependency-review']['result'] = 'skipped'
            self.assertEqual(self.run_gate(results, event), 0)
            results['codeql']['result'] = 'skipped'
            self.assertNotEqual(self.run_gate(results, event), 0)

    def test_missing_jobs_and_unknown_events_fail(self):
        for name in self.successes():
            results = self.successes()
            del results[name]
            self.assertNotEqual(self.run_gate(results), 0)
        for malformed in ({}, None, [], {'codeql': 'success'}):
            self.assertNotEqual(self.run_gate(malformed), 0)
        self.assertNotEqual(self.run_gate(self.successes(), 'workflow_run'), 0)


if __name__ == '__main__':
    unittest.main(verbosity=2)
