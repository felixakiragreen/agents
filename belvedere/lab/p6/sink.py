#!/usr/bin/env python3
"""P6 wire sink — captures the RAW bytes cmux puts on a surface's pty.

Raw mode with `-echo` and no ICRNL, so nothing between cmux and this file rewrites
anything; DECSET 2004 is announced first so the emulator sees an application that
has bracketed paste ENABLED (that is the state a Claude TUI is in).

  python3 sink.py <out-file> [seconds] [--no-2004]
"""
import os, sys, termios, time, tty

out_path = sys.argv[1]
seconds = float(sys.argv[2]) if len(sys.argv) > 2 else 15.0
bracketed = '--no-2004' not in sys.argv

fd = sys.stdin.fileno()
old = termios.tcgetattr(fd)
tty.setraw(fd)
if bracketed:
	sys.stdout.write('\x1b[?2004h')
sys.stdout.write('SINK READY\r\n')
sys.stdout.flush()

os.set_blocking(fd, False)
end = time.time() + seconds
with open(out_path, 'wb') as out:
	while time.time() < end:
		try:
			b = os.read(fd, 65536)
			if b:
				out.write(b)
				out.flush()
		except BlockingIOError:
			pass
		time.sleep(0.02)

termios.tcsetattr(fd, termios.TCSADRAIN, old)
if bracketed:
	sys.stdout.write('\x1b[?2004l')
sys.stdout.write('\r\nSINK DONE\r\n')
sys.stdout.flush()
