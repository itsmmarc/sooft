export namespace TempusPlaza {
	export function getImageUrl(mapName: string, quality?: 'medium' | 'full') {
		return quality == 'medium'
			? `https://tempusplaza.com/map-backgrounds/medium/${mapName}.webp`
			: `https://tempusplaza.com/map-backgrounds/${mapName}.webp`;
	}
}
