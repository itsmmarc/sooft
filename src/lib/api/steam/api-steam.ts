import { convertSteamId } from '$lib/util';

export namespace Steam {
	export async function fetchPlayerSummary(steamID: string) {
		steamID = convertSteamId(steamID, 'SteamID64') as string;

		const endpoint = `/api/steam/GetPlayerSummaries`;
		console.log(endpoint);
		const response = await fetch('/api/steam/GetPlayerSummaries', {
			method: 'POST',
			body: JSON.stringify({ steamids: steamID }),
			headers: { 'Content-Type': 'application/json' }
		});
		let data = await response.json();
		console.log(data);

		if (data) {
			let steamPlayer: Steam.PlayerSummary = data.response[0];
			return steamPlayer;
		} else {
			return null;
		}
	}
	export async function fetchPlayerSummaries(steamIds: string[]) {
		for (let i = 0; i < steamIds.length; i++) {
			steamIds[i] = convertSteamId(steamIds[i], 'SteamID64') as string;
		}

		const endpoint = `/api/steam/GetPlayerSummaries`;
		console.log(endpoint);
		const response = await fetch('/api/steam/GetPlayerSummaries', {
			method: 'POST',
			body: JSON.stringify({ steamids: steamIds }),
			headers: { 'Content-Type': 'application/json' }
		});
		let data = await response.json();
		console.log(data);

		if (data) {
			let steamPlayers: Steam.PlayerSummary[] = data.response;
			return steamPlayers;
		} else {
			return null;
		}
	}

	export async function fetchPlayerAvatar(steamID: string) {
		let player = await fetchPlayerSummary(steamID);

		if (player) {
			return player.avatarfull;
		} else {
			return '';
		}
	}
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
