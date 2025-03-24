import { spawnMap } from './objects/map.js';
import { spawnPlayer } from './objects/player.js';

function update({ canvas, ctx, player, map, delta }) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	map.draw({ delta });
	player.draw({ delta, map });
}

const attachControls = ({ player, map }) => {
	document.addEventListener('keydown', (event) => {
		player.keydown(event.key, map);
	});
	document.addEventListener('keyup', () => {
		player.keyup();
	});
};

const initGame = async () => {
	const canvas = document.getElementById('gameCanvas');
	const ctx = canvas.getContext('2d');

	const player = await spawnPlayer(ctx);
	const map = await spawnMap(ctx);

	attachControls({ player, map });

	let lastTime = 0;
	function gameLoop(currentTime) {
		const delta = currentTime - lastTime;
		update({ canvas, ctx, player, map, delta });
		lastTime = currentTime;
		requestAnimationFrame(gameLoop);
	}

	return {
		start: gameLoop,
	};
};

window.onload = async () => {
	const game = await initGame();
	game.start();
};
