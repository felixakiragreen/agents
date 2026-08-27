# lab/p4 — restore semantics probes

Everything here runs from **outside cmux** (the observer cannot live inside the thing it
kills — see the brief §A/§V).

| file | what it does |
|---|---|
| `capture.sh <label>` | Snapshots everything observable from outside: cmux app pid, socket, agent pids, transcript bytes/lines/mtime, plus a copy of cmux's restore state. Writes `snapshots/<label>/`. |
| `relaunch-observe.sh <secs>` | `open -a cmux`, then polls every 0.4 s and prints each state transition with its offset from T0 — the restore timeline. |
| `control.py <hup\|kill> <uuid> [hold]` | Q3 control. pty-forks `claude` with the prompt in argv, waits until generation is underway, holds `hold` seconds, then kills the terminal the way a tab dies (`SIGHUP` to the fg pgroup + master close) or hard (`SIGKILL`). Reports transcript state either side. |
| `inspect.py <uuid>` | Record types + assistant text of a transcript — the "did the in-flight turn survive" check. |
| `tail.py <path> [n]` | Tail of a transcript as typed records, with `stop_reason` — the flush-signature check. |

```sh
./capture.sh pre-relaunch
./relaunch-observe.sh 45
python3 control.py hup $(python3 -c 'import uuid;print(uuid.uuid4())') 6
```

`snapshots/session.at-quit.json` is the one irreplaceable artifact: cmux's restore state
frozen at the instant of a real quit, with two live agent bindings in it.
