// The design laws' two render-side primitives, tested where they can lie about the truth layer.
//
// **Encapsulation is a derivation, never an invention** (B9 §3): the name a card leads with must be
// text the document already wrote, and a text with no name must render whole rather than be cut to
// fit. A cropped truth on the rail is worse than a long one — Felix reads these cards to decide
// what to ignite.

import { expect, test, describe } from 'bun:test';
import { encap, encapHtml, legend, mantleKeys } from './html';

describe('encap — the name a card leads with', () => {
	test('the em-dash seam of the city\'s own board rows', () => {
		const e = encap('B9: visual law sweep — §3 design laws over the pre-law pages: fonts, legends');
		expect(e.name).toBe('B9: visual law sweep');
		expect(e.encapsulated).toBe(true);
		expect(e.full).toContain('fonts, legends');
	});

	test('the dash outranks the colon: an id and its name are ONE phrase (Felix\'s own examples)', () => {
		expect(encap('E1: register policy — the walk never rides the request thread').name).toBe('E1: register policy');
	});

	test('a colon is the seam where the line has no dash at all', () => {
		expect(encap('Baton: fire B9 before the close gates').name).toBe('Baton');
	});

	test('a text with no seam renders WHOLE and gains no control', () => {
		const e = encap('Felix fires the summons below when the window closes');
		expect(e.encapsulated).toBe(false);
		expect(e.name).toBe(e.full);
		expect(encapHtml(e.full, '/', 'rail-text')).not.toContain('<details');
	});

	test('a head running past six words is not a name — the text renders whole', () => {
		const long = 'one two three four five six seven — and then the rest of it';
		expect(encap(long).encapsulated).toBe(false);
		expect(encap(long).name).toBe(long);
	});

	test('the seam is looked for in the FIRST LINE only: a name never crosses a paragraph', () => {
		expect(encap('A whole sentence with no seam at all\n\nB2 — the glass spine').encapsulated).toBe(false);
	});

	test('a seam with nothing before it names nothing', () => {
		expect(encap('— a dropped baton').encapsulated).toBe(false);
	});

	test('the [expand] carries the WHOLE text, name included — nothing is only in the summary', () => {
		const html = encapHtml('B4: hands — /ignite /worktree /focus /halt, and the credential', '/', 'rail-text');
		expect(html).toContain('<p class="encap">B4: hands</p>');
		expect(html).toContain('<summary>expand</summary>');
		expect(html).toContain('B4: hands — /ignite /worktree /focus /halt, and the credential');
	});

	test('the disclosure is the browser\'s: no script, no state, no client JSON', () => {
		expect(encapHtml('a — b', '/', 'x')).not.toContain('<script');
		expect(encapHtml('a — b', '/', 'x')).not.toContain('onclick');
	});
});

describe('legends — every coloured view owes the reader one', () => {
	test('the mantle keys are the rig\'s own table, plus the honest unstamped case', () => {
		const keys = mantleKeys(new Map([['builder', 'cyan'], ['architect', 'green']]));
		expect(keys.join('')).toContain('builder');
		expect(keys.join('')).toContain('tone-cyan');
		expect(keys.at(-1)).toContain('unstamped');
	});

	test('a colour the tone vocabulary does not know greys rather than vanishing', () => {
		expect(mantleKeys(new Map([['digger', 'chartreuse']]))[0]).toContain('tone-grey');
	});

	test('the legend is dismiss-less: no control, no script, always drawn', () => {
		const html = legend(['a', 'b']);
		expect(html).toContain('class="legend"');
		expect(html).not.toContain('<button');
		expect(html).not.toContain('<details');
	});
});

test('a seam inside a bold span leaves no orphaned marker in the name', () => {
	// The city really writes this: `**Fork — choose one**: …` (lab/b3/city/probe-fork).
	expect(encap('**Fork — choose one**: the Digger or the Builder').name).toBe('Fork');
	expect(encap('**B8: glass hardenings** — five of them, all live, nothing escalated').name).toBe('**B8: glass hardenings**');
});

test('an [expand] that would reveal less than the card already shows is furniture, so there is none', () => {
	// Live case: `parseIssues` hands over the entry's first line only (agents/ISSUES.md:297).
	const e = encap('**The continuous flow — the');
	expect(e.encapsulated).toBe(false);
	expect(encapHtml(e.full, '/', 'prose')).not.toContain('<details');
});
