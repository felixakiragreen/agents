#!/usr/bin/env python3
"""P1 probe — drive an interactive claude session in a pty.

Headless (-p) never emits Notification; the glass's needs-input state depends on it,
so the interactive path has to be measured directly.  Steps are (delay_s, keys) pairs.
"""
import fcntl, os, pty, select, struct, sys, termios, time

steps = []
for arg in sys.argv[2:]:
	d, _, keys = arg.partition(':')
	steps.append((float(d), keys.encode().decode('unicode_escape').encode()))

pid, fd = pty.fork()
if pid == 0:
	for v in ('CLAUDE_CODE_SESSION_ID','CLAUDE_CODE_CHILD_SESSION','CLAUDE_CODE_MESSAGING_SOCKET',
	          'CLAUDE_CODE_MESSAGING_TOKEN','CLAUDE_PID','CLAUDECODE','CLAUDE_EFFORT',
	          'CLAUDE_CODE_ENTRYPOINT','CLAUDE_CODE_EXECPATH','CLAUDE_ENV_FILE'):
		os.environ.pop(v, None)
	os.environ['TERM'] = 'xterm-256color'
	os.execv('/Users/felix/.local/bin/claude', ['claude', '--model', 'haiku'])

fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack('HHHH', 40, 120, 0, 0))
log = open(sys.argv[1], 'wb')
t0 = time.time()
for delay, keys in steps:
	while time.time() - t0 < delay:
		r, _, _ = select.select([fd], [], [], 0.2)
		if r:
			try: log.write(os.read(fd, 65536))
			except OSError: break
	os.write(fd, keys)
deadline = time.time() + 15
while time.time() < deadline:
	r, _, _ = select.select([fd], [], [], 0.5)
	if r:
		try:
			b = os.read(fd, 65536)
		except OSError: break
		if not b: break
		log.write(b)
log.close()
try: os.waitpid(pid, os.WNOHANG)
except ChildProcessError: pass
print('pty run done')
