// The `FocusView` seam — *"panes are a replaceable surface"* (D13) as code.
//
// The three-pane shell is the stable frame; what stands in Focus is a tenant, and Action follows
// it (keel §3). B13 ships placeholders; the Workshop (B15), the Works (B10) and the Chat (B16)
// move in through this interface and nowhere else. Replacing a pane is a module, never a rebuild —
// so this file holds the contract and the register of who has signed it, and nothing else. It
// mounts nothing and draws nothing: the app owns the hosts.

import type { DeckSnapshot, PaneState } from './deck-model';

export type FocusView = {
	/** The registry key, and the fragment the deck remembers a focus by. One lowercase word. */
	readonly name: string;
	/** Encapsulation-first: the 1–6 word name the pane head leads with. */
	readonly title: string;
	/**
	 * The pane states this tenant can actually draw. A tenant that declares only `typical` is
	 * telling the shell not to offer the other two — the affordance is the tenant's to declare,
	 * because only it knows whether it has a one-word form.
	 */
	readonly states: readonly PaneState[];
	/**
	 * Both hosts at once: Action follows Focus, so one tenant owns both and there is no second
	 * registry for the Action pane. Called on swap-in; the hosts are empty and are the tenant's
	 * until `unmount`.
	 */
	mount(focusHost: HTMLElement, actionHost: HTMLElement): void;
	/** Swap-out. The shell empties the hosts afterwards; a tenant holding a timer clears it here. */
	unmount(): void;
	/** Every poll and every state change. `snap` is null before the first poll answers. */
	draw(snap: DeckSnapshot | null, focusState: PaneState, actionState: PaneState): void;
	/**
	 * **Optional, and added at B15 — the fifth member.** The building this tenant wants the server to
	 * open in the next snapshot, or null for none. B13's four members are what a tenant needs to
	 * *draw*; the Workshop is the first that needs the server to *answer differently*, because one
	 * building's whole board is 44 kB and broadcasting every building's would cost the poll thirty
	 * times what it costs (B13 F5). Additive: a tenant that omits this asks for nothing and the
	 * snapshot is exactly what it was. The shell puts the answer in the poll's query and nowhere
	 * else — no second endpoint, no second timer.
	 */
	needs?(focusState: PaneState): string | null;
};

/**
 * The one piece of state that crosses panes: **which building the City is pointing at.**
 *
 * The ontology is City → Building → Agent (keel §3), so a click in Context has to reach whatever
 * stands in Focus — and a tenant cannot be handed it through `draw()` without every tenant that
 * does not care being made to carry it. One named cell, written by the City and read by the
 * tenant, is the whole mechanism. B15's Workshop reads it here; until it moves in, the placeholder
 * names the selection rather than pretending the click did nothing.
 */
export const selection: { building: string | null } = { building: null };

/**
 * The deck's one document opener, registered by whichever tenant owns a viewer (the Workshop
 * today). It sits beside `selection` for the same reason: the decoder's tooltips are the shell's,
 * they live outside every pane, and their **jump** has to land in the viewer that already exists
 * rather than growing a second one (B20 §3). A tenant with no viewer leaves it null and the
 * decoder simply offers no jump — the affordance is the tenant's to provide, never the shell's to
 * fake.
 */
export const viewer: { open: ((path: string, line: number | null) => void) | null } = { open: null };

/**
 * The shell's own swap, registered at boot — so one tenant can hand Focus to another (B10).
 *
 * It sits here for the same reason `viewer` does: the Works draws a landed node's *landing record*,
 * whose references open in the one viewer, which belongs to the Workshop. Reaching across through
 * this cell keeps the seam one-directional — a tenant asks the shell to swap, it never reaches into
 * another tenant — and a null here simply means no swap is possible, never a broken control.
 */
export const swap: { to: ((name: string) => void) | null } = { to: null };

const signed = new Map<string, FocusView>();

/** Sign the lease. A second tenant under one name is a bug, not a replacement — it throws. */
export function moveIn(view: FocusView): void {
	if (signed.has(view.name)) throw new Error(`deck: two tenants named "${view.name}"`);
	signed.set(view.name, view);
}

export const tenant = (name: string): FocusView | null => signed.get(name) ?? null;

/** In signing order — the shell draws its swap buttons from this, so order is the tenants' own. */
export const tenants = (): FocusView[] => [...signed.values()];
