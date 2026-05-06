import { PersistentState } from '@friendofsvelte/state';

export type Settings = {
	font: 'sans-serif' | 'courier-prime';
	color: string;
	enablePRs: boolean;
	enableTags: boolean;
	enableTeamColors: boolean;
	enableSinglePOV: boolean;
	enablePOVGuide: boolean;
};

export type Player = {
	name: string;
	tag: string;
	flag: string;
	score: number;
	pr: string;
};

export type Overlay = {
	bestOf: number;
	leftPlayer: Player;
	rightPlayer: Player;
	map: string;
	stage: string;
};

export type Items = {
	names: Array<string>;
	tags: Array<string>;
	flags: Array<string>;
	maps: Array<string>;
	stages: Array<string>;
};

export const defaultStages = [
	'Round 1',
	'Round 2',
	'Quarterfinals',
	'Semifinals',
	'Finals',
	'Grand Finals',
	"Loser's Quarters",
	"Loser's Semis",
	"Loser's Finals"
];

// overlay settings
export const settings = new PersistentState('settings', {
	font: 'sans-serif',
	color: '#000000',
	enablePRs: false,
	enableTags: false,
	enableTeamColors: false,
	enableSinglePOV: false,
	enablePOVGuide: false
} as Settings);

// overlay state
export const overlay = new PersistentState('overlay', {
	bestOf: 3,
	leftPlayer: { name: '', tag: '', flag: '', score: 0, pr: '' },
	rightPlayer: { name: '', tag: '', flag: '', score: 0, pr: '' },
	map: '',
	stage: ''
} as Overlay);

// overlay items
export const items = new PersistentState('items', {
	names: [],
	tags: [],
	flags: [],
	maps: [],
	stages: defaultStages
} as Items);
