import { items } from './storage.svelte';
import { Player } from './types';

export namespace TFMapMethods {
	export function fileNameToShortName(fileName: string) {
		let tmp = fileName.match(/(?<=_).+/); // match name after first '_', eg: 'beef' from 'jump_beef'
		return tmp ? tmp[0].replace('_', ' ') : '';
	}

	export function fileNameToTfId(fileName: string): string {
		return fileName.replace('_', '-');
	}
}

export function getPlayer(name?: string, steamID3?: number, players?: Player[]): Player {
	if (name) {
		return players
			? { ...players.filter((p) => p.name == name)[0] }
			: { ...items.current.players.filter((p) => p.name == name)[0] };
	}
	if (steamID3) {
		return players
			? { ...players.filter((p) => p.steamID3 == steamID3)[0] }
			: { ...items.current.players.filter((p) => p.steamID3 == steamID3)[0] };
	}
	return { ...items.current.players.filter((p) => p.name == '')[0] };
}

// https://github.com/SteamRun/SteamIDConverter/blob/master/SteamIDConverter.html
export function convertSteamId(
	id: string,
	resultFormat: 'SteamID32' | 'SteamID64' | 'SteamID3'
): string | number {
	let SID64_1 = '7656'; //Starting Steam ID is 76561197960265728 (javascript cant handle numbers that big, so i took firt 4 digits out) and use them as a string
	let SID64_S = Number(1197960265728); //the rest of the digits from the Starting Steam ID (to calculate with) after calculations the remaining numbers will be SID64_2

	let isSteamID = false; //prepare in case that its not a steamid
	let isCustomUrl = false; //prepare in case that its not a custom url

	let PatternSteam3ID = /^\[([Ug]):([0-9]):([0-9]+)\]$/; // [U:1:40571167] [letter:number:longer_number]
	let PatternSteamID32 = /^STEAM_([0-9]):([0-9]):([0-9]+)$/; // STEAM_0:1:20285583 //find a string starting with STEAM_number:number:longer_number
	let PatternSteamID64 = /7656([0-9]{12,14})/; // 76561198000836895 number starting with 7656 (SID32_1) and has 12-14 more numbers after (SID64_2)

	let S3ID_1;
	let S3ID_2;
	let S3ID_3 = 0;

	let SID32_1;
	let SID32_2;
	let SID32_3;

	let SID64_2;

	if (PatternSteam3ID.test(id)) {
		// [U:1:40571167]
		let Steam3ID = PatternSteam3ID.exec(id);
		S3ID_1 = Steam3ID[1];
		S3ID_2 = Number(Steam3ID[2]);
		S3ID_3 = Number(Steam3ID[3]);
		if (Math.abs(S3ID_3 % 2) == 1) {
			let SID32_2 = 1;
		} else {
			let SID32_2 = 0;
		} //odd or even
		SID32_3 = (S3ID_3 - SID32_2) / 2;
		SID64_2 = S3ID_3 + SID64_S;
		isSteamID = true;
	} else if (PatternSteamID32.test(id)) {
		// STEAM_0:1:20285583
		let SteamID32 = PatternSteamID32.exec(id);
		SID32_1 = Number(SteamID32[1]);
		SID32_2 = Number(SteamID32[2]);
		SID32_3 = Number(SteamID32[3]);
		S3ID_3 = SID32_3 * 2 + SID32_2;
		SID64_2 = S3ID_3 + SID64_S;
		isSteamID = true;
	} else if (PatternSteamID64.test(id)) {
		// 76561198000836895
		let SteamID64 = PatternSteamID64.exec(id);
		SID64_2 = Number(SteamID64[1]);
		S3ID_3 = SID64_2 - SID64_S;
		if (Math.abs(S3ID_3 % 2) == 1) {
			SID32_2 = 1;
		} else {
			SID32_2 = 0;
		} //odd or even
		SID32_3 = (S3ID_3 - SID32_2) / 2;
		isSteamID = true;
	}

	if (isSteamID == true) {
		//handle SteamIDs
		let S3ID = S3ID_3; // modified to only return the numeric part as this is what is used for kingstripes' tf2 websocket. eg: returns 40571167 instead of [U:1:40571167]
		let SID32 = 'STEAM_0:' + SID32_2 + ':' + SID32_3;
		let SID64 = SID64_1 + SID64_2;

		switch (resultFormat) {
			case 'SteamID32':
				return SID32;
			case 'SteamID64':
				return SID64;
			case 'SteamID3':
				return S3ID;
			default:
				return '';
		}
	} else {
		return '';
	}
}
