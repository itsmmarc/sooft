import { items, overlay } from './storage.svelte';
import { Player } from './types';

export type Match = {
	A: Player;
	B: Player;
	winner: 'A' | 'B' | '';
	winDest: Array<string | number> | null;
	loseDest: Array<string | number> | null;
};

abstract class Bracket {
	abstract type: 8 | 4;
	Upper: any;
	Lower: any;
}
export class Bracket8 extends Bracket {
	type: 8 = 8;
	Upper: { QuarterFinals: Match[]; SemiFinals: Match[]; Final: Match[]; GrandFinal: Match[] };
	Lower: { Round1: Match[]; QuarterFinals: Match[]; SemiFinal: Match[]; Final: Match[] };

	constructor() {
		super();
		this.Upper = {
			QuarterFinals: [
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: ['Upper', 'SemiFinals', 0, 'A'],
					loseDest: ['Lower', 'Round1', 0, 'A']
				},
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: ['Upper', 'SemiFinals', 0, 'B'],
					loseDest: ['Lower', 'Round1', 0, 'B']
				},
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: ['Upper', 'SemiFinals', 1, 'A'],
					loseDest: ['Lower', 'Round1', 1, 'A']
				},
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: ['Upper', 'SemiFinals', 1, 'B'],
					loseDest: ['Lower', 'Round1', 1, 'B']
				}
			],
			SemiFinals: [
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: ['Upper', 'Final', 0, 'A'],
					loseDest: ['Lower', 'QuarterFinals', 0, 'B']
				},
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: ['Upper', 'Final', 0, 'B'],
					loseDest: ['Lower', 'QuarterFinals', 1, 'B']
				}
			],
			Final: [
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: ['Upper', 'GrandFinal', 0, 'A'],
					loseDest: ['Lower', 'Final', 0, 'B']
				}
			],
			GrandFinal: [
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: null,
					loseDest: null
				}
			]
		};
		this.Lower = {
			Round1: [
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: ['Lower', 'QuarterFinals', 0, 'A'],
					loseDest: null
				},
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: ['Lower', 'QuarterFinals', 1, 'A'],
					loseDest: null
				}
			],
			QuarterFinals: [
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: ['Lower', 'SemiFinal', 0, 'A'],
					loseDest: null
				},
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: ['Lower', 'SemiFinal', 0, 'B'],
					loseDest: null
				}
			],
			SemiFinal: [
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: ['Lower', 'Final', 0, 'A'],
					loseDest: null
				}
			],
			Final: [
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: ['Upper', 'GrandFinal', 0, 'B'],
					loseDest: null
				}
			]
		};
	}
}

export class Bracket4 extends Bracket {
	type: 4 = 4;
	Upper: { QuarterFinals: Match[]; SemiFinal: Match[]; GrandFinal: Match[] };
	Lower: { SemiFinal: Match[]; Final: Match[] };

	constructor() {
		super();
		this.Upper = {
			QuarterFinals: [
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: ['Upper', 'SemiFinal', 0, 'A'],
					loseDest: ['Lower', 'SemiFinal', 0, 'A']
				},
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: ['Upper', 'SemiFinal', 0, 'B'],
					loseDest: ['Lower', 'SemiFinal', 0, 'B']
				}
			],
			SemiFinal: [
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: ['Upper', 'GrandFinal', 0, 'A'],
					loseDest: ['Lower', 'Final', 0, 'B']
				}
			],
			GrandFinal: [
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: null,
					loseDest: null
				}
			]
		};
		this.Lower = {
			SemiFinal: [
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: ['Lower', 'Final', 0, 'A'],
					loseDest: null
				}
			],
			Final: [
				{
					A: new Player(),
					B: new Player(),
					winner: '',
					winDest: ['Upper', 'GrandFinal', 0, 'B'],
					loseDest: null
				}
			]
		};
	}
}

// MARK: REFACTOR
export function setMatchWinner(bracket: Bracket, m: Match, w: 'A' | 'B' | '') {
	// console.log('setting match winner');
	// console.log(m);
	// console.log(w);
	// remove winner from subsequent matches
	if (!w) {
		m.winner = w;
		if (m.winDest) {
			setMatchWinner(bracket, bracket[m.winDest[0]][m.winDest[1]][m.winDest[2]], '');
		}
		if (m.loseDest) {
			setMatchWinner(bracket, bracket[m.loseDest[0]][m.loseDest[1]][m.loseDest[2]], '');
		}
	}

	// progress players
	if (m.A.name && m.B.name) {
		m.winner = w;
		if (m.winDest) {
			bracket[m.winDest[0]][m.winDest[1]][m.winDest[2]][m.winDest[3]] = w ? m[w] : new Player();
		}
		if (m.loseDest) {
			bracket[m.loseDest[0]][m.loseDest[1]][m.loseDest[2]][m.loseDest[3]] = w
				? m[w == 'A' ? 'B' : 'A']
				: new Player();
		}
	}

	// console.log(m);
	// console.log('---------------------------');
}

export function clearMatchWinner(bracket: Bracket, m: Match) {
	// remove winner from subsequent matches
	m.winner = '';
	if (m.winDest) {
		clearMatchWinner(bracket, bracket[m.winDest[0]][m.winDest[1]][m.winDest[2]]);
	}
	if (m.loseDest) {
		clearMatchWinner(bracket, bracket[m.loseDest[0]][m.loseDest[1]][m.loseDest[2]]);
	}

	// progress
	if (m.A.name && m.B.name) {
		if (m.winDest) {
			bracket[m.winDest[0]][m.winDest[1]][m.winDest[2]][m.winDest[3]] = new Player();
		}
		if (m.loseDest) {
			bracket[m.loseDest[0]][m.loseDest[1]][m.loseDest[2]][m.loseDest[3]] = new Player();
		}
	}
}
