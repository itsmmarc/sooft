import { Player, settings } from '$lib/storage.svelte';
import { convertSteamId } from '$lib/util';

export namespace Steam {
	// GetPlayerSummaries
	// https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={apiKey}&steamids={steamId64}
	export interface GetPlayerSummaries {
		response: {
			players: PlayerSummary[];
		};
	}
	export interface PlayerSummary {
		steamid: string; // steamId64
		communityvisibilitystate: number;
		profilestate: number;
		personaname: string;
		profileurl: string;
		avatar: string;
		avatarmedium: string;
		avatarfull: string;
		avatarhash: string;
		lastlogoff: number;
		personastate: number;
		primaryclanid: number;
		timecreated: number;
		personastateflags: number;
		loccountrycode: string;
	}
}
