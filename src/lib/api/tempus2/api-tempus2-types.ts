// Tempus2 API Interfaces
// https://tempus2.xyz/apidocs/

// MARK: Util
class SteamID {
	Id: string;

	constructor(Id?: string) {
		this.Id = Id ?? '';
	}
}
class TempusID {
	Id: number;

	constructor(Id?: number) {
		this.Id = Id ?? 0;
	}
}

interface t2Author {
	id: number; // author id
	name: string;
	user_id: TempusID;
	steamid: SteamID;
	user_name: string;
	map_count: number;
}

interface t2Run {
	id: number; // run id
	duration: number;
	date: number;
	name: string;
	user_id: TempusID;
	steamid: SteamID;
}

interface t2Run2 {
	id: number;
	duration: number;
	date: number;
	name: string;
	player_info: t2PlayerInfo;
	steamid: SteamID;
}

interface t2ZoneCounts {
	checkpoint: number;
	bonus_end: number;
	bonus: number;
	course: number;
	course_end: number;
	trick: number;
	map_end: number;
	map: number;
	misc: number;
}

type t2ZoneTypes =
	| 'map'
	| 'map_end'
	| 'course'
	| 'course_end'
	| 'checkpoint'
	| 'bonus'
	| 'bonus_end'
	| 'trick'
	| 'misc';

interface t2Zone {
	id: number;
	map_id: number;
	type: t2ZoneTypes;
	zoneindex: number;
	custom_name: null;
}

interface t2MapZone extends t2Zone {
	type: 'map';
}
interface t2MapEndZone extends t2Zone {
	type: 'map_end';
}
interface t2CourseZone extends t2Zone {
	type: 'course';
}
interface t2CourseEndZone extends t2Zone {
	type: 'course_end';
}
interface t2CheckpointZone extends t2Zone {
	type: 'checkpoint';
}
interface t2BonusZone extends t2Zone {
	type: 'bonus';
}
interface t2BonusEndZone extends t2Zone {
	type: 'bonus_end';
}
interface t2TrickZone extends t2Zone {
	type: 'trick';
}
interface t2MiscZone extends t2Zone {
	type: 'misc';
}

// MARK: GET
// Map Overview 1
// /maps/id/{mapId}/fullOverview
// /maps/id/{mapName}/fullOverview
interface t2MapFullOverview {
	map_info: { id: number; name: string; date_added: number };
	tier_info: {
		soldier: number;
		demoman: number;
	};
	videos: {
		soldier: string | null;
		demoman: string | null;
	};
	authors: t2Author[];
	soldier_runs: t2Run[];
	demoman_runs: t2Run[];
	zone_counts: t2ZoneCounts;
}

// Map Overview 2
// /maps/id/{mapId}/fullOverview2
// /maps/id/{mapName}/fullOverview2
interface t2MapFullOverview2 {
	map_info: { id: number; name: string; date_added: number };
	tier_info: {
		soldier: number;
		demoman: number;
	};
	rating_info: {
		soldier: number;
		demoman: number;
	};
	intended_class_info: {
		soldier: boolean;
		demoman: boolean;
	};
	videos: {
		soldier: string | null;
		demoman: string | null;
	};
	authors: t2Author[];
	soldier_runs: t2Run2[];
	demoman_runs: t2Run2[];
	zone_counts: t2ZoneCounts;
	zones: {
		checkpoint: t2CheckpointZone[];
		bonus_end: t2BonusEndZone[];
		bonus: t2BonusZone[];
		course: t2CourseZone[];
		trick: t2TrickZone[];
		course_end: t2CourseEndZone[];
		map_end: t2MapEndZone[];
		map: t2MapZone[];
		misc: t2MiscZone[];
	};
}

// Player Rank
// /players/id/{playerId}/rank
interface t2PlayerRank {
	player_info: {
		id: TempusID;
		steamid: SteamID;
		name: string;
		first_seen: number;
		last_seen: number;
		country: string;
	};
	rank_info: {
		points: number;
		rank: number;
		total_ranked: number;
	};
	class_rank_info: {
		'3': {
			points: number;
			rank: number;
			total_ranked: number;
			title: string;
		};
		'4': {
			points: number;
			rank: number;
			total_ranked: number;
			title: string;
		};
	};
}

// Player Info
// /players/id/{playerId}/info
interface t2PlayerInfo {
	name: string;
	id: TempusID;
	steamid: SteamID;
}

// Player Stats
// /players/id/{playerId}/stats
interface t2PlayerStats {
	player_info: {
		id: TempusID;
		steamid: SteamID;
		name: string;
		first_seen: number;
		last_seen: number;
		country: string;
		country_code: string;
	};
	rank_info: {
		points: number;
		rank: number;
		total_ranked: number;
	};
	class_rank_info: {
		'3': {
			points: number;
			rank: number;
			total_ranked: number;
			title: string;
		};
		'4': {
			points: number;
			rank: number;
			total_ranked: number;
			title: string;
		};
	};
	country_rank_info: {
		rank: number;
		total_ranked: number;
	};
	country_class_rank_info: {
		'3': {
			rank: number;
			total_ranked: number;
		};
		'4': {
			rank: number;
			total_ranked: number;
		};
	};
	pr_stats: {
		course: {
			count: number;
			points: number;
		};
		map: {
			count: number;
			points: number;
		};
		bonus: {
			count: number;
			points: number;
		};
	};
	wr_stats: {};
	top_stats: {
		// top times (tt)
		map: {
			count: number;
			points: number;
		};
	};
	zone_count: {
		special: {
			count: number;
		};
		checkpoint: {
			count: number;
		};
		bonus_end: {
			count: number;
		};
		linear: {
			count: number;
		};
		bonus: {
			count: number;
		};
		course: {
			count: number;
		};
		course_end: {
			count: number;
		};
		trick: {
			count: number;
		};
		map_end: {
			count: number;
		};
		map: {
			count: number;
		};
		misc: {
			count: number;
		};
	};
}

// Search Players and Maps
// /search/playersAndMaps/{nameQuery}
interface t2SearchResults {
	players: t2PlayerInfo[];
	maps: Array<{ id: number; name: string }>;
}
