const TILE_SIZE = 32;
const FRAME_WIDTH = 32;
const FRAME_HEIGHT = 48;
const ANIMATION_SPEED = 8; // Adjust for smoothness

function getAnimationFrameCoords(animationState, tick) {
	const directionMap = {
		walkingSouth: 0,
		facingSouth: 0,
		walkingWest: 1,
		facingWest: 1,
		walkingEast: 2,
		facingEast: 2,
		walkingNorth: 3,
		facingNorth: 3,
	};

	const frameY = directionMap[animationState];
	const isWalking = animationState.startsWith('walking');

	const frameX = isWalking ? tick % 4 : 0;

	return {
		frameX,
		frameY,
	};
}

function updatePlayer(player, delta) {
	if (delta > 50) {
		//update player position
		if (player.moving && player.animProgress < 1) {
			player.animProgress += 1 / ANIMATION_SPEED;
		}
		if (player.animProgress >= 1) {
			player.animProgress = 1;
			player.moving = false;
		}
	}
}

function drawPlayer(ctx, player, delta) {
	const progress = player.moving ? player.animProgress : 1;
	const renderX =
		(player.prevX + (player.x - player.prevX) * progress) * TILE_SIZE;
	const renderY =
		(player.prevY + (player.y - player.prevY) * progress) * TILE_SIZE;

	const { frameX, frameY } = getAnimationFrameCoords(
		player.animationState,
		player.animationTick
	);
	const isWalking = player.animationState.startsWith('walking');
	if (isWalking && delta >= 100) {
		player.animationTick =
			player.animationTick === 3 ? 0 : player.animationTick + 1;
	}

	ctx.drawImage(
		player.spriteSheet,
		frameX * FRAME_WIDTH,
		frameY * FRAME_HEIGHT,
		FRAME_WIDTH,
		FRAME_HEIGHT,
		renderX,
		renderY - 16,
		TILE_SIZE,
		TILE_SIZE + 16
	);
}

const keydown = ({ key, player, map }) => {
	if (player.moving) return; // Prevent interrupting a current move

	// console.log('keydown');

	// Store current position as previous
	player.prevX = player.x;
	player.prevY = player.y;
	player.animProgress = 0;
	player.moving = true;

	let newX = player.x;
	let newY = player.y;

	if (key === 'ArrowUp') {
		newY--;
		player.animationState = 'walkingNorth';
	}
	if (key === 'ArrowDown') {
		newY++;
		player.animationState = 'walkingSouth';
	}
	if (key === 'ArrowLeft') {
		newX--;
		player.animationState = 'walkingWest';
	}
	if (key === 'ArrowRight') {
		newX++;
		player.animationState = 'walkingEast';
	}

	const tile = map.getTile(newX, newY);
	if (tile === 0) {
		player.x = newX;
		player.y = newY;
		player.advanceFrame();
	}
};

const keyup = (player) => {
	//player.moving = false;
	player.animationState =
		{
			walkingNorth: 'facingNorth',
			walkingEast: 'facingEast',
			walkingSouth: 'facingSouth',
			walkingWest: 'facingWest',
		}[player.animationState] || player.animationState;
};

export const spawnPlayer = async (ctx) => {
	const player = {
		x: 4,
		y: 4,
		spriteSheet: new Image(),
		frameX: 0,
		frameY: 0,
		frameCount: 0,
		moving: false,
		prevX: 4, // Previous grid X
		prevY: 4, // Previous grid Y
		animProgress: 1, // 1 means no interpolation needed
		animationState: 'facingSouth',
		animationTick: 0,
		deltaAcc: 0,
	};
	player.spriteSheet.src = 'sprites/player.png';

	player.draw = ({ delta, map }) => {
		if (delta < 100) {
			player.deltaAcc += delta;
		}
		updatePlayer(player, delta + player.deltaAcc);
		drawPlayer(ctx, player, delta + player.deltaAcc);

		if (delta + player.deltaAcc > 100) {
			player.deltaAcc = 0;
		}
	};

	player.advanceFrame = () => player.frameCount++;
	player.keydown = (key, map) => keydown({ key, player, map });
	player.keyup = () => keyup(player);

	await new Promise((resolve) => {
		player.spriteSheet.onload = resolve;
	});

	return player;
};
