import type { Probe } from '../probe';
export const fixture = true;
export default async function (p: Probe): Promise<void> {
	await p.goto('/deck');
	const s = await p.ask('/deck/state');
	const snap = JSON.parse(s.body) as { register: { buildings: { building: string; attention: number; label: string }[] } };
	for (const b of snap.register.buildings) console.log(b.attention, b.label, b.building);
}
