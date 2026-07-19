import { Steam } from '$lib/api/steam/api-steam';
import { json } from '@sveltejs/kit';
import { STEAM_API_KEY } from '$env/static/private';

export async function POST(request: Request) {
	const body = await request.request.json();
	console.log('body:');
	console.log(body);

	if (!('steamids' in body)) {
		return json({}, { status: 400 });
	}

	let ids = body.steamids;

	let idsStr: string = ids.join(',');

	const endpoint = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${idsStr}`;
	console.log(endpoint);
	const response = await fetch(endpoint);
	let data: Steam.GetPlayerSummaries = await response.json();

	console.log('steamdata:');
	console.log(data);

	if (data.response.players.length == 0) {
		return null;
	}

	return json({ response: data.response.players }, { status: 201 });
}
