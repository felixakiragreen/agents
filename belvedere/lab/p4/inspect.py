#!/usr/bin/env python3
import json,os,sys
sid=sys.argv[1]
f=os.path.expanduser(f'~/.claude/projects/-Users-felix-code-agents/{sid}.jsonl')
types=[];asst=0
for line in open(f):
    r=json.loads(line);t=r.get('type');types.append(t)
    if t=='assistant':
        asst+=1
        c=(r.get('message') or {}).get('content')
        if isinstance(c,list):
            for b in c:
                if b.get('type')=='text': print('   ASSISTANT TEXT:',repr(b['text'][:150]))
print('  record types:',types)
print('  assistant records:',asst)
