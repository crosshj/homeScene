export const TILE_SIZE = 32;
export const MAP_ROWS = 10;
export const MAP_COLS = 15;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

export const player = {
  x: 4,
  y: 4,
  spriteSheet: new Image(),
  frameX: 0,
  frameY: 0,
  moving: false,
  prevX: 4, // Previous grid X
  prevY: 4, // Previous grid Y
  animProgress: 1, // 1 means no interpolation needed
};
player.spriteSheet.src = "sprites/player.png"; // Replace with actual sprite sheet

const FRAME_WIDTH = 32;
const FRAME_HEIGHT = 48;
const ANIMATION_SPEED = 8; // Adjust for smoothness
let frameCount = 0;

export const map = [
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
  0: "floor.png",
  1: "wall.png",
  2: "tv.png",
  3: "bed.png",
};

const tileImages = {};
for (const key in tiles) {
  tileImages[key] = new Image();
  tileImages[key].src = "sprites/" + tiles[key];
}

export function drawMap() {
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

export function drawPlayer() {
  const progress = player.moving ? player.animProgress : 1;
  const renderX =
    (player.prevX + (player.x - player.prevX) * progress) * TILE_SIZE;
  const renderY =
    (player.prevY + (player.y - player.prevY) * progress) * TILE_SIZE;
  ctx.drawImage(
    player.spriteSheet,
    player.frameX * FRAME_WIDTH,
    player.frameY * FRAME_HEIGHT,
    FRAME_WIDTH,
    FRAME_HEIGHT,
    renderX,
    renderY - 16,
    TILE_SIZE,
    TILE_SIZE + 16
  );
}

export function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (player.moving && player.animProgress < 1) {
    player.animProgress += 1 / 8; // 8 frames total
    if (player.animProgress >= 1) {
      player.animProgress = 1;
      player.moving = false;
    }
  }
  drawMap();
  drawPlayer();
}

document.addEventListener("keydown", (event) => {
  if (player.moving) return; // Prevent interrupting a current move

  // Store current position as previous
  player.prevX = player.x;
  player.prevY = player.y;
  player.animProgress = 0;
  player.moving = true;

  let newX = player.x;
  let newY = player.y;

  if (event.key === "ArrowUp") {
    newY--;
    player.frameY = 3;
  }
  if (event.key === "ArrowDown") {
    newY++;
    player.frameY = 0;
  }
  if (event.key === "ArrowLeft") {
    newX--;
    player.frameY = 1;
  }
  if (event.key === "ArrowRight") {
    newX++;
    player.frameY = 2;
  }

  if (map[newY] && map[newY][newX] === 0) {
    player.x = newX;
    player.y = newY;
    frameCount++;
    if (frameCount % ANIMATION_SPEED === 0) {
      player.frameX = (player.frameX + 1) % 3;
    }
  }
});

document.addEventListener("keyup", () => {
  player.moving = false;
  player.frameX = 1; // Default idle frame (middle frame)
});

function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

player.spriteSheet.onload = () => {
  gameLoop();
};
