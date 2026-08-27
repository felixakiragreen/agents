#!/usr/bin/env python3
"""P4: summarize the tail of a claude transcript — what state did the session end in?"""
import json,sys
path,n = sys.argv[1], int(sys.argv[2]) if len(sys.argv)>2 else 12
lines=open(path).read().splitlines()
print(f"{path}  total_records={len(lines)}")
for line in lines[-n:]:
    try: r=json.loads(line)
    except Exception as e: print("  UNPARSEABLE:",line[:120]); continue
    t=r.get('type'); ts=r.get('timestamp','-')
    msg=r.get('message') or {}
    sr=msg.get('stop_reason')
    parts=[]
    c=msg.get('content')
    if isinstance(c,str): parts.append('STR:'+c[:100].replace('\n',' '))
    elif isinstance(c,list):
        for b in c:
            bt=b.get('type')
            if bt=='text': parts.append('text:'+b['text'][:90].replace('\n',' '))
            elif bt=='thinking': parts.append('thinking(%d ch)'%len(b.get('thinking','')))
            elif bt=='tool_use': parts.append('tool_use:'+b.get('name',''))
            elif bt=='tool_result': parts.append('tool_result')
            else: parts.append(bt or '?')
    extra=''
    if t not in ('user','assistant','system'): extra=' keys='+str(list(r.keys())[:8])
    print(f"  [{t}] {ts} stop_reason={sr}{extra}")
    if parts: print("      "+' | '.join(parts)[:200])
