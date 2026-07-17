import { PersistentState } from '@friendofsvelte/state';
import { type Items, type Overlay, type Settings, Player, TFMap } from './types';
import { defaultBracket8 } from './Bracket.svelte';

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
	font: 'font-space-grotesk',
	monoFont: 'font-chivo-mono',
	hue: 0,
	saturation: 100,
	enableMovingBG: true,
	enablePRs: true,
	enableAvatars: true,
	enableTags: false,
	enableFlags: true,
	enableGradient: true,
	enableTeamColors: true,
	enableSinglePOV: false,
	enablePOVGuide: false,
	useShortMapNames: true,
	tfWebSocketToken: '',
	overlayScene: 'MatchOverlay',
	obsWsIp: '',
	obsWsPw: '',
	steamApiKey: ''
};

export const defaultOverlay: Overlay = {
	bestOf: 3,
	leftPlayer: new Player(),
	rightPlayer: new Player(),
	map: new TFMap(),
	stage: '',
	class: 'soldier',
	bracket: 'whole'
};

export const defaultItems: Items = {
	players: [new Player()],
	maps: [new TFMap()],
	stages: defaultStages,
	bracket: defaultBracket8
};

// overlay settings
export const settings = new PersistentState('settings', defaultSettings, 'localStorage');

// overlay state
export const overlay = new PersistentState('overlay', defaultOverlay);

// overlay items
export const items = new PersistentState('items', defaultItems);

export function fullReset() {
	settings.current = defaultSettings;
	overlay.current = defaultOverlay;
	items.current = defaultItems;
}
