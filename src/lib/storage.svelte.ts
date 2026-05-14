import { PersistentState } from '@friendofsvelte/state';

export type Settings = {
	font: 'cause' | 'comic-relief' | 'courier-prime' | 'fredoka' | 'inter';
	hue: number;
	saturation: number;
	enableMovingBG: boolean;
	enablePRs: boolean;
	enableAvatars: boolean;
	enableTags: boolean;
	enableFlags: boolean;
	enableGradient: boolean;
	enableTeamColors: boolean;
	enableSinglePOV: boolean;
	enablePOVGuide: boolean;
};

export type Rank = {
	soldier: number;
	demo: number;
	overall: number;
};

export type Player = {
	name: string;
	avatarURL?: string;
	tag?: string;
	flag?: string;
	pr?: string;
	rank?: Rank;
	numWRs?: number;
	bestRun?: string;
	score: number;
};

export type Overlay = {
	bestOf: number;
	leftPlayer: Player;
	rightPlayer: Player;
	map: string;
	stage: string;
};

export type Items = {
	players: Player[];
	maps: Array<string>;
	stages: Array<string>;
};

export const defaultStages: Array<string> = [
	'',
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

export const defaultSettings: Settings = {
	font: 'cause',
	hue: 0,
	saturation: 100,
	enableMovingBG: true,
	enablePRs: false,
	enableAvatars: true,
	enableTags: false,
	enableFlags: true,
	enableGradient: true,
	enableTeamColors: false,
	enableSinglePOV: false,
	enablePOVGuide: false
};

// overlay settings
export const settings = new PersistentState('settings', defaultSettings);

// overlay state
export const overlay = new PersistentState('overlay', {
	bestOf: 3,
	leftPlayer: { name: '', avatarURL: '', tag: '', flag: '', score: 0, pr: '' },
	rightPlayer: { name: '', avatarURL: '', tag: '', flag: '', score: 0, pr: '' },
	map: '',
	stage: ''
} as Overlay);

// overlay items
export const items = new PersistentState('items', {
	players: [],
	maps: [],
	stages: defaultStages
} as Items);
