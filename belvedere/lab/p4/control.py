#!/usr/bin/env python3
"""P4 Q3 control — what does a PLAIN TERMINAL death cost a live claude turn?

Spawns claude in a pty with a long prompt in argv (turn starts immediately),
waits until generation is provably underway, then kills the terminal the way a
terminal tab dies (SIGHUP to the foreground pgroup + master close) or hard (SIGKILL).
Records transcript state either side of the death.

Usage: control.py <hup|kill> <session-uuid>
"""
import fcntl, os, pty, select, signal, struct, subprocess, sys, termios, time, json

MODE, SID = sys.argv[1], sys.argv[2]
HOLD = float(sys.argv[3]) if len(sys.argv)>3 else 12.0
CWD = '/Users/felix/code/agents'
TDIR = os.path.expanduser('~/.claude/projects/-Users-felix-code-agents')
TRANSCRIPT = f'{TDIR}/{SID}.jsonl'
LOG = f'/Users/felix/code/agents/belvedere/lab/p4/snapshots/control-{MODE}.pty.log'
PROMPT = ("Count from 1 to 300. Print each number on its own line followed by a "
          "two-word comment. Use no tools. Do not stop early.")

def tstate(label):
	try:
		st = os.stat(TRANSCRIPT)
		n = sum(1 for _ in open(TRANSCRIPT))
		return f'{label}: bytes={st.st_size} lines={n} mtime={time.strftime("%H:%M:%S", time.localtime(st.st_mtime))}'
	except FileNotFoundError:
		return f'{label}: (transcript does not exist)'

pid, fd = pty.fork()
if pid == 0:
	for v in ('CLAUDE_CODE_SESSION_ID','CLAUDE_CODE_CHILD_SESSION','CLAUDE_CODE_MESSAGING_SOCKET',
	          'CLAUDE_CODE_MESSAGING_TOKEN','CLAUDE_PID','CLAUDECODE','CLAUDE_EFFORT',
	          'CLAUDE_CODE_ENTRYPOINT','CLAUDE_CODE_EXECPATH','CLAUDE_ENV_FILE'):
		os.environ.pop(v, None)
	os.environ['TERM'] = 'xterm-256color'
	os.environ['CLAUDE_CONFIG_DIR'] = os.path.expanduser('~/.claude')
	os.chdir(CWD)
	os.execv('/Users/felix/.local/bin/claude',
	         ['claude', '--session-id', SID, '--model', 'haiku',
	          '-n', f'p4ctl-{MODE}', '--permission-mode', 'auto', PROMPT])

fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack('HHHH', 40, 120, 0, 0))
log = open(LOG, 'wb')
t0 = time.time()
seen = b''
gen_at = None
# stream until generation is provably underway, then hold a beat so it is mid-turn
while time.time() - t0 < 40 + HOLD:
	r, _, _ = select.select([fd], [], [], 0.3)
	if r:
		try: b = os.read(fd, 65536)
		except OSError: break
		if not b: break
		log.write(b); log.flush(); seen += b
	if gen_at is None and (b'esc to interrupt' in seen or b'tokens' in seen):
		gen_at = time.time()
		print(f'[+{gen_at-t0:5.2f}s] generation underway (matched "esc to interrupt"/"tokens")')
	if gen_at and time.time() - gen_at > HOLD:
		break

if gen_at is None:
	print('!! generation never detected — aborting probe'); 
print(f'[+{time.time()-t0:5.2f}s] {tstate("PRE-DEATH ")}')
print(f'[+{time.time()-t0:5.2f}s] killing terminal: mode={MODE}')

pgid = os.getpgid(pid)
t_kill = time.time()
if MODE == 'hup':
	os.killpg(pgid, signal.SIGHUP)   # exactly what a dying terminal emulator sends
else:
	os.killpg(pgid, signal.SIGKILL)
os.close(fd)                          # master close: the pty goes away with the tab

# watch how long the process takes to actually die
dead_at = None
while time.time() - t_kill < 20:
	try:
		w, _ = os.waitpid(pid, os.WNOHANG)
		if w == pid: dead_at = time.time(); break
	except ChildProcessError:
		dead_at = time.time(); break
	time.sleep(0.1)
log.close()
print(f'death: signalled at t_kill, reaped after {"%.2f"%(dead_at-t_kill) if dead_at else ">20"}s')
time.sleep(2.0)
print(tstate('POST-DEATH'))
