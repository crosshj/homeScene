const TILE_SIZE = 32;
const MAP_ROWS = 10;
const MAP_COLS = 15;

const map = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const tiles = {
	0: 'floor.png',
	1: 'wall.png',
	2: 'tv.png',
	3: 'bed.png',
};

function drawMap(ctx, map, tileImages) {
	for (let row = 0; row < MAP_ROWS; row++) {
		for (let col = 0; col < MAP_COLS; col++) {
			let tile = map[row][col];
			ctx.drawImage(
				tileImages[tile],
				col * TILE_SIZE,
				row * TILE_SIZE,
				TILE_SIZE,
				TILE_SIZE
			);
		}
	}
}

export const spawnMap = async (ctx) => {
	const tileImages = {};
	for (const key in tiles) {
		tileImages[key] = new Image();
		tileImages[key].src = 'sprites/' + tiles[key];
		await new Promise((resolve) => {
			tileImages[key].onload = resolve;
		});
	}
	return {
		draw: () => drawMap(ctx, map, tileImages),
		getTile: (x, y) => map?.[y]?.[x],
	};
};
