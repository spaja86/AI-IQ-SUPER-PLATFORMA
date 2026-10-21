"""Trusted static-page compiler. Source is data, never Python/JS/shell code.
Linux only; install resource and syscall restrictions BEFORE reading source.
"""
import ctypes
import errno
import html
import json
import os
import resource
import sys

MAX_SOURCE = 16 * 1024
MAX_ARTIFACT = 64 * 1024


def isolate():
    if sys.platform != 'linux':
        raise RuntimeError('linux-required')
    # Load runtime dependencies before closing all path/network/process access.
    seccomp = ctypes.CDLL('libseccomp.so.2', use_errno=True)
    libc = ctypes.CDLL(None, use_errno=True)
    seccomp.seccomp_init.argtypes = [ctypes.c_uint32]
    seccomp.seccomp_init.restype = ctypes.c_void_p
    seccomp.seccomp_syscall_resolve_name.argtypes = [ctypes.c_char_p]
    seccomp.seccomp_rule_add.argtypes = [ctypes.c_void_p, ctypes.c_uint32, ctypes.c_int, ctypes.c_uint]
    seccomp.seccomp_load.argtypes = [ctypes.c_void_p]
    seccomp.seccomp_release.argtypes = [ctypes.c_void_p]
    for kind, value in [(resource.RLIMIT_AS, 128 * 1024 * 1024),
                        (resource.RLIMIT_CPU, 2), (resource.RLIMIT_FSIZE, 0),
                        (resource.RLIMIT_NOFILE, 32), (resource.RLIMIT_NPROC, 0),
                        (resource.RLIMIT_CORE, 0)]:
        resource.setrlimit(kind, (value, value))
    # Only pipe fds 0/1/2 remain; close any inherited capabilities as defense in depth.
    os.closerange(3, 1024)
    if libc.prctl(38, 1, 0, 0, 0) != 0:  # PR_SET_NO_NEW_PRIVS
        raise RuntimeError('no-new-privileges-failed')
    context = seccomp.seccomp_init(0x00050000 | errno.EPERM)
    if not context:
        raise RuntimeError('seccomp-init-failed')
    try:
        # Default deny. No open/stat-by-path, socket, exec, fork/clone, ptrace,
        # mount, io_uring, privilege or resource-limit-changing syscalls.
        for name in ('read', 'write', 'close', 'fstat', 'lseek', 'brk', 'mmap',
                     'mprotect', 'munmap', 'mremap', 'madvise', 'futex',
                     'clock_gettime', 'rt_sigreturn', 'rt_sigaction',
                     'rt_sigprocmask', 'sigaltstack', 'getrandom', 'getpid',
                     'gettid', 'exit', 'exit_group'):
            number = seccomp.seccomp_syscall_resolve_name(name.encode('ascii'))
            if number < 0 or seccomp.seccomp_rule_add(context, 0x7fff0000, number, 0) != 0:
                raise RuntimeError('seccomp-rule-failed')
        if seccomp.seccomp_load(context) != 0:
            raise RuntimeError('seccomp-load-failed')
    finally:
        seccomp.seccomp_release(context)


def unique_object(pairs):
    value = {}
    for key, item in pairs:
        if key in value:
            raise ValueError('duplicate-key')
        value[key] = item
    return value


def compile_page(raw):
    if len(raw) > MAX_SOURCE:
        raise ValueError('source-limit')
    doc = json.loads(raw.decode('utf-8', errors='strict'), object_pairs_hook=unique_object)
    if not isinstance(doc, dict) or set(doc) != {'schemaVersion', 'title', 'paragraphs'}:
        raise ValueError('invalid-source-schema')
    if type(doc['schemaVersion']) is not int or doc['schemaVersion'] != 1:
        raise ValueError('invalid-source-version')
    if not isinstance(doc['title'], str) or not 1 <= len(doc['title']) <= 120:
        raise ValueError('invalid-title')
    paragraphs = doc['paragraphs']
    if not isinstance(paragraphs, list) or not 1 <= len(paragraphs) <= 32:
        raise ValueError('invalid-paragraphs')
    if any(not isinstance(p, str) or len(p) > 1024 for p in paragraphs):
        raise ValueError('invalid-paragraph')
    title = html.escape(doc['title'], quote=True)
    content = ''.join('<p>' + html.escape(p, quote=True) + '</p>' for p in paragraphs)
    artifact = ('<!doctype html><html lang="sr"><head><meta charset="utf-8">'
                '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; base-uri \'none\'; form-action \'none\'">'
                '<title>' + title + '</title></head><body><main><h1>' + title + '</h1>' + content + '</main></body></html>')
    encoded = artifact.encode('utf-8')
    if len(encoded) > MAX_ARTIFACT:
        raise ValueError('artifact-limit')
    return encoded


def main():
    try:
        isolate()
    except Exception:
        os.write(2, b'sandbox-unavailable\n')
        return 78  # Never continue with a weaker execution path.
    os.write(2, b'sandbox-ready\n')
    try:
        artifact = compile_page(sys.stdin.buffer.read(MAX_SOURCE + 1))
        sys.stdout.buffer.write(artifact)
        sys.stdout.buffer.flush()
        return 0
    except Exception:
        os.write(2, b'compile-failed\n')
        return 1


if __name__ == '__main__':
    sys.exit(main())
