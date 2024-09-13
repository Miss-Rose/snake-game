import './style.css';
import { Application, Container } from 'pixi.js';
import SnakeGame from './src/SnakeGame.js';
import { createMenu } from './src/Menu.js';

const app = new Application();
const cellSize = 30;
const playGroundSize = 4;
const borderSize = 1;
const menuWidth = 11;

async function setup() {
  await app.init({
    backgroundColor: 0x0a7482,
    width: playGroundSize * cellSize + borderSize * cellSize * 2,
    height: playGroundSize * cellSize + borderSize * cellSize * 2,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });
  document.body.appendChild(app.canvas);
  globalThis.__PIXI_APP__ = app;
}

(async () => {
  await setup();
  const gameContainer = new Container();
  const game = new SnakeGame(
    gameContainer,
    cellSize,
    playGroundSize,
    borderSize
  );
  game.initialization();
  app.stage.addChild(gameContainer);

  const menuCnt = document.getElementById('menu');
  menuCnt.style.width = menuWidth * cellSize + 'px';
  createMenu(game);
})();
