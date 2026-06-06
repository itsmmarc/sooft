import { PersistentState } from '@friendofsvelte/state';
import { settings, overlay } from './storage.svelte';
import {
	type MessageTypes,
	type PickBansSessionStateEvent,
	defaultMessages
} from './websocket-types';
import { SvelteMap } from 'svelte/reactivity';

let ws: WebSocket;
export const messages = new PersistentState('messages', defaultMessages);

export function initializeWebSocket() {
	if (ws) {
		ws.close();
	}

	messages.current = defaultMessages;

	if (!settings.current.useWebSocket) {
		return;
	}

	console.log('initializing websocket');

	ws = new WebSocket(`https://console.jumpfortress.tf/?token=${settings.current.webSocketToken}`);
	ws.onmessage = function (event) {
		const data: MessageTypes = JSON.parse(event.data);
		console.log('--------------------');
		console.log(data);
		console.log('--------------------');

		console.log(timer.current.left);
		console.log(timer.current.right);

		switch (data.type) {
			case 'pickbans_session_state':
				messages.current.mapPicks.push(data);
				break;
			case 'timer_start':
				console.log('--- I HAVE A TIMER START MESSAGE');
				timer_start(checkTimerSide(data));
				messages.current.timer.push(data);
				break;
			case 'timer_stop':
				console.log('--- I HAVE A TIMER STOP MESSAGE');
				timer_stop(checkTimerSide(data));
				messages.current.timer.push(data);
				break;
			case 'timer_finish':
				console.log('--- I HAVE A TIMER FINISH MESSAGE');
				timer_finish(checkTimerSide(data), data.timestamp);
				messages.current.timer.push(data);
				break;
			case 'timer_checkpoint':
				console.log('--- I HAVE A TIMER CHECKPOINT MESSAGE');
				timer_checkpoint(checkTimerSide(data), data.formattedCheckpoint, data.timestamp);
				break;
			default:
				return;
		}
	};

	function checkTimerSide(data: Exclude<MessageTypes, PickBansSessionStateEvent>): string {
		console.log('checking side');
		let key =
			data.steamid == overlay.current.leftPlayer.steamID3
				? 'left'
				: data.steamid == overlay.current.rightPlayer.steamID3
					? 'right'
					: '';
		console.log(key);
		return key;
	}
}

const defaultTimer = {
	timer_start: false,
	timer_stop: false,
	timer_finish: false,
	finishTime: 0
};

export const timer = new PersistentState('timer', {
	left: defaultTimer,
	right: defaultTimer,
	leftcps: new SvelteMap([]) as SvelteMap<string, number>,
	rightcps: new SvelteMap([]) as SvelteMap<string, number>
});

// don't start timer if already finished
function timer_start(side: string) {
	console.log('enter timer_start function');
	if (side === 'left' && !timer.current.left.timer_finish) {
		Object.assign(timer.current.left, defaultTimer);
		timer.current.left.timer_start = true;
		console.log('--timer.current.left');
		console.log(timer.current.left);
	} else if (side === 'right' && !timer.current.right.timer_finish) {
		Object.assign(timer.current.right, defaultTimer);
		timer.current.right.timer_start = true;
	}
}

// don't stop timer if already finished
function timer_stop(side: string) {
	console.log('enter timer_stop function');
	if (side === 'left' && !timer.current.left.timer_finish) {
		Object.assign(timer.current.left, defaultTimer);
		timer.current.leftcps.clear();
		timer.current.left.timer_stop = true;
		console.log('--timer.current.left');
		console.log(timer.current.left);
	} else if (side === 'right' && !timer.current.right.timer_finish) {
		Object.assign(timer.current.right, defaultTimer);
		timer.current.leftcps.clear();
		timer.current.right.timer_stop = true;
	}
}

function timer_finish(side: string, finishTime: number) {
	if (side === 'left') {
		timer.current.left.timer_start = false;
		timer.current.left.timer_finish = true;
		timer.current.left.finishTime = finishTime;
		timer.current.leftcps.set('finish', finishTime);
		console.log('--timer.current.left');
		console.log(timer.current.left);
	} else {
		timer.current.right.timer_start = false;
		timer.current.right.timer_finish = true;
		timer.current.right.finishTime = finishTime;
		timer.current.rightcps.set('finish', finishTime);
	}
}

function timer_checkpoint(side: string, checkpointName: string, checkpointTime: number) {
	if (side === 'left') {
		timer.current.leftcps.set(checkpointName, checkpointTime);
	} else {
		timer.current.rightcps.set(checkpointName, checkpointTime);
	}
}

export function resetTimer(side: string) {
	if (side === 'left') {
		Object.assign(timer.current.left, defaultTimer);
		timer.current.leftcps.clear();
	} else {
		Object.assign(timer.current.right, defaultTimer);
		timer.current.rightcps.clear();
	}
}

export const resetPulse = $state({
	state: false
});

export function csToTime(cs: number) {
	const minutes = Math.floor(cs / 6000)
		.toString()
		.padStart(2, '0');
	const seconds = Math.floor((cs / 100) % 60)
		.toString()
		.padStart(2, '0');
	const centiseconds = Math.floor(cs % 100)
		.toString()
		.padStart(2, '0');

	return `${minutes}:${seconds}.${centiseconds}`;
}
