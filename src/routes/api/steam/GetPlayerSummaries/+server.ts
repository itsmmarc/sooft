import { Player, settings } from '$lib/storage.svelte';
import { type Steam } from '$lib/api/steam/api-steam-types';
import { convertSteamId } from '$lib/util';
import { json } from '@sveltejs/kit';
import { STEAM_API_KEY } from '$env/static/private';

export async function POST(request: Request) {
	const body = await request.request.json();

	console.log('body:');
	console.log(body);

	// if (!('id' in body)) {
	// 	return json({}, { status: 400 });
	// }

	let id = body.id;

	// if (!id || typeof id != 'string') {
	// 	return json({}, { status: 400 });
	// }

	id = convertSteamId(id, 'SteamID64');

	const endpoint = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${id}`;
	console.log(endpoint);
	const response = await fetch(endpoint);
	let data: Steam.GetPlayerSummaries = await response.json();

	console.log('steamdata:');
	console.log(data);

	if (data.response.players.length == 0) {
		return null;
	}

	const p = data.response.players[0];

	return json({ response: p }, { status: 201 });
}
