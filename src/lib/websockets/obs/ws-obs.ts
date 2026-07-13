import OBSWebSocket from 'obs-websocket-js';

export const obs = new OBSWebSocket();

export async function obsConnect(ip: string, password: string) {
	await obs.connect(ip, password);
	console.log(obs);
}
