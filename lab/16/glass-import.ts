// Row 016 DoD 5 — the glass imports the library. One line, one building, one shape.
import { parse } from '../../doctrine';

const b = parse(`${process.env.HOME}/code/agents/belvedere`);

console.log(JSON.stringify({
	building: b.building,
	board: b.board.map(x => ({ heading: x.heading, rows: x.rows.length })),
	rowsTyped: `${b.board.flatMap(x => x.rows).filter(r => (r.felixGate || (r.mantle && r.tier)) && r.state).length}/${b.board.flatMap(x => x.rows).length}`,
	firstRow: b.board[0]?.rows[0],
	ledgerTail: b.ledgerTail && { date: b.ledgerTail.date, mantle: b.ledgerTail.mantle, tier: b.ledgerTail.tier, row: b.ledgerTail.row },
	baton: b.baton && { holder: b.baton.holder, instruments: b.baton.instruments.length },
	decisionQueue: b.decisionQueue.length,
	issues: b.issues.length,
	kickoffs: b.kickoffs.map(k => `${k.mantle} · ${k.tier}`),
	fails: b.fails.length,
}, null, 2));
