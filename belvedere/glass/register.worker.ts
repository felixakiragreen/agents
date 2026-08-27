// The register walk, on a thread that is not the one serving pages.
//
// `discover()` is nine seconds of synchronous filesystem over ~50 000 directories (B2 E1), and
// Bun runs one JavaScript thread: a refresh on the request thread does not merely cost the
// request that triggered it, it costs every request that arrives during it. Measured at this
// build row before this file existed — 20 requests at 2 s spacing, crossing the TTL twice:
// p95 **8.300 s**, max 8.612 s, against a p50 of 0.037 s. Two of twenty page loads stalled.
//
// So the walk moves here. One message out, then the worker is done — no protocol, no state, no
// second copy of the register's law. `register.ts` owns the held copy and the TTL; this file
// owns nothing.

import { discover, lastWalk } from '../../doctrine';
import { CITY } from './paths';

const entries = discover([CITY]).map(b => ({ building: b.building, path: b.path, files: b.files }));
postMessage({ entries, at: Date.now(), suppressed: lastWalk.suppressed });
