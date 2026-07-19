import { defaultBracket8, type Bracket4, type Bracket8 } from './Bracket.svelte';
import type { Tempus2 } from './api/tempus2/api-tempus2';

export const Fonts = [
	'font-fredoka',
	'font-inter',
	'font-bebas',
	'font-montserrat',
	'font-roboto',
	'font-space-grotesk'
] as const;
export type Font = (typeof Fonts)[number];

export const MonoFonts = [
	'font-dm-mono',
	'font-anonymous-pro',
	'font-ubuntu-mono',
	'font-azeret-mono',
	'font-chivo-mono',
	'font-spline-sans-mono'
] as const;
export type MonoFont = (typeof MonoFonts)[number];

export const OverlayScenes = [
	'',
	'MatchOverlay',
	'MapOverlay',
	'BracketOverlay',
	'PlayerCardOverlay',
	'PlayerListOverlay',
	'ThanksOverlay'
] as const;
export type OverlayScene = (typeof OverlayScenes)[number];

export type Settings = {
	font: Font;
	monoFont: MonoFont;
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
	useShortMapNames: boolean;
	tfWebSocketToken: string;
	overlayScene: OverlayScene;
	obsWsIp: string;
	obsWsPw: string;
	steamApiKey: string;
};

export const TFClasses = ['demoman', 'soldier', 'overall'] as const;
export type TFClass = (typeof TFClasses)[number];

export type Rank = {
	[key in TFClass]: { points: number; rank: number; title: string | null };
};

export class Player {
	name: string = '';
	score: number = 0;
	tempusID: number = 0;
	steamID3: number = 0;
	steamID: string = '';
	avatarURL: string = '';
	tag: string = '';
	flag: string = '';
	pr: string = ''; // only used for manual PRs
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	rank: Rank = {
		demoman: { points: 0, rank: 0, title: '' },
		soldier: { points: 0, rank: 0, title: '' },
		overall: { points: 0, rank: 0, title: '' }
	};
	WRs: number = 0;
	TTs: number = 0;
	bestRun: string = '';
	note: string = '';
	favouriteMap: string = '';
}

export type MapRun = {
	tempusID: number;
	rank: number;
	duration: number;
};

export class TFMap {
	fileName: string = '';
	shortName: string = '';
	mapZoneId: number = 0;
	intendedClass: { soldier: boolean; demoman: boolean } = { soldier: false, demoman: false };
	tier: { soldier: number; demoman: number } = { soldier: 0, demoman: 0 };
	authors: Tempus2.Author[] = [];
	worldRecordInfo: { soldier: Tempus2.Run2 | undefined; demoman: Tempus2.Run2 | undefined } = {
		soldier: undefined,
		demoman: undefined
	};
	runs: { soldier: MapRun[]; demoman: MapRun[] } = { soldier: [], demoman: [] };

	imageURL?: string = '';
}

export const nullPlayer: Player = Object.freeze(new Player());

export const BracketOptions = ['whole', 'upper', 'lower'] as const;
export type BracketOption = (typeof BracketOptions)[number];

export type Overlay = {
	bestOf: number;
	leftPlayer: Player;
	rightPlayer: Player;
	map: TFMap;
	stage: string;
	class: TFClass;
	bracket: BracketOption;
};

export type Items = {
	players: Player[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	maps: TFMap[];
	stages: Array<string>;
	bracket: Bracket8 | Bracket4;
};
