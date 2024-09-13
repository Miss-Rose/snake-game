import { Container, Graphics, TextStyle, Text } from 'pixi.js';
import { COLORS, SPEED } from './variables.js';
import Snake from './Snake.js';
import Food from './Food.js';

export default class SnakeGame {
  constructor(gameContainer, cellSize, playGroundSize, borderSize) {
    this.gameContainer = gameContainer;
    this.cellSize = cellSize;
    this.playGroundSize = playGroundSize;
    this.borderSize = borderSize;

    this.snakeContainer = new Container();
    this.foodContainer = new Container();
    this.activePlayGround = new Container();
    this.background = new Graphics();

    this.snake = new Snake(cellSize, playGroundSize, this.snakeContainer);
    this.food = new Food(
      cellSize,
      playGroundSize,
      this.foodContainer,
      this.snake.snake
    );

    this.lastMoveTime = 0;
    this.moveInterval = SPEED;
    this.isRunning = true;
    this.gameType = 'Classic';
    this.score = 0;
    this.bestScore = localStorage.getItem('bestScore')
      ? parseInt(localStorage.getItem('bestScore'))
      : 0;

    this.hintContainer = new Container();
  }

  initialization = () => {
    this.drawPlayground();
    this.createSnake();
    this.createFood();
    this.drawBorder();
  };

  drawPlayground = () => {
    this.activePlayGround.x = this.borderSize * this.cellSize;
    this.activePlayGround.y = this.borderSize * this.cellSize;
    this.background.rect(
      0,
      0,
      this.cellSize * this.playGroundSize,
      this.cellSize * this.playGroundSize
    );
    this.background.fill(COLORS.background);
    this.activePlayGround.addChild(this.background);

    const grid = new Graphics();
    for (let i = 0; i <= this.playGroundSize; i++) {
      grid.moveTo(i * this.cellSize, 0);
      grid.lineTo(i * this.cellSize, this.playGroundSize * this.cellSize);

      grid.moveTo(0, i * this.cellSize);
      grid.lineTo(this.playGroundSize * this.cellSize, i * this.cellSize);
    }
    grid.stroke({ width: 0.5, color: COLORS.grid });

    this.activePlayGround.addChild(grid);
    this.gameContainer.addChild(this.activePlayGround);
  };

  drawBorder = () => {
    const border = new Graphics();
    border.rect(
      this.cellSize / 2,
      this.cellSize / 2,
      this.playGroundSize * this.cellSize +
        this.borderSize * 2 * this.cellSize -
        this.cellSize,
      this.playGroundSize * this.cellSize +
        this.borderSize * 2 * this.cellSize -
        this.cellSize
    );
    border.stroke({ width: this.cellSize, color: COLORS.border });
    this.gameContainer.addChild(border);
  };

  createSnake = () => {
    this.snake.createSnake();
    this.activePlayGround.addChild(this.snakeContainer);
  };

  createFood = () => {
    this.food.createFoodElement(this.snake.snake);
    this.activePlayGround.addChild(this.foodContainer);
  };

  initKeyDown = () => {
    document.addEventListener('keydown', this.onKeyDown);
  };

  onKeyDown = (e) => {
    switch (e.key) {
    case 'ArrowUp':
      if (this.snake.direction.y === 0) {
        this.snake.direction = { x: 0, y: -1 };
      }
      break;
    case 'ArrowDown':
      if (this.snake.direction.y === 0) {
        this.snake.direction = { x: 0, y: 1 };
      }
      break;
    case 'ArrowLeft':
      if (this.snake.direction.x === 0) {
        this.snake.direction = { x: -1, y: 0 };
      }
      break;
    case 'ArrowRight':
      if (this.snake.direction.x === 0) {
        this.snake.direction = { x: 1, y: 0 };
      }
      break;
    default: break;
    }
  };

  gameLoop = () => {
    const loop = (time) => {
      const currentTime = time;
      if (currentTime - this.lastMoveTime > this.moveInterval) {
        this.moveSnake();
        this.lastMoveTime = currentTime;
      }
      if (this.isRunning) {
        requestAnimationFrame(loop);
      }
    };
    requestAnimationFrame(loop);
  };

  stopGameLoop = () => {
    this.isRunning = false;
  };

  showHint = () => {
    const style = new TextStyle({
      fontSize: 36,
      fill: COLORS.snakeBody,
      align: 'center',
      dropShadow: {
        color: '#000000',
        blur: 4,
        angle: Math.PI / 6,
        distance: 6,
      },
    });
    const hintText = new Text({
      text: 'Game is over',
      style,
    });
    hintText.anchor.set(0.5);
    hintText.x = (this.playGroundSize * this.cellSize) / 2;
    hintText.y = (this.playGroundSize * this.cellSize) / 2;
    this.hintContainer.addChild(hintText);
    this.gameContainer.addChild(this.hintContainer);
  };

  setGameType = (type) => {
    this.gameType = type;
  };

  isOutPlayground = (head) => {
    return (
      head.x + this.snake.direction.x < 0 ||
      head.y + this.snake.direction.y < 0 ||
      head.x + this.snake.direction.x >= this.playGroundSize ||
      head.y + this.snake.direction.y >= this.playGroundSize
    );
  };

  isCollision = (head) => {
    return this.snake.snake
      .slice(1)
      .some((segment) => segment.x === head.x && segment.y === head.y);
  };

  moveHelper = (head) => {
    const newHead = {
      x: head.x + this.snake.direction.x,
      y: head.y + this.snake.direction.y,
    };
    this.snake.snake.unshift(newHead);
    this.snake.snake.pop();

    this.snake.snakeElements.forEach((segment, index) => {
      const newSegment = this.snake.snake[index];
      segment.x = newSegment.x * this.cellSize;
      segment.y = newSegment.y * this.cellSize;
    });

    if (
      newHead.x === this.food.foodCoords.x &&
      newHead.y === this.food.foodCoords.y
    ) {
      this.updateScore();
      this.createNewSnakeSegment();
      this.createFood();

      if (this.gameType === 'Speed') {
        this.moveInterval *= 0.9;
      }
    }
  };

  moveSnake = () => {
    const totalCells = this.playGroundSize * this.playGroundSize;
    if (this.snake.snake.length + 1 > totalCells) {
      this.stopGameLoop();
      setTimeout(() => this.showHint(), 200);
      return;
    }

    const head = this.snake.snake[0];
    const newHead = {
      x: head.x + this.snake.direction.x,
      y: head.y + this.snake.direction.y,
    };
    const isOutside = this.isOutPlayground(head);

    if (this.gameType === 'No Die') {
      if (head.x < 0) {
        head.x = this.background.width / this.cellSize;
      } else if (head.x === this.background.width / this.cellSize) {
        head.x = 0;
      } else if (head.y < 0) {
        head.y = this.background.height / this.cellSize;
      } else if (head.y === this.background.height / this.cellSize) {
        head.y = 0;
      }
      this.moveHelper(head);
    } else {
      if (isOutside || this.isCollision(newHead)) {
        this.stopGameLoop();
        setTimeout(() => this.showHint(), 200);
      } else {
        this.moveHelper(head);
      }
    }
  };

  updateScore = () => {
    this.score += 1;
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('bestScore', `${this.bestScore}`);
    }
    document.getElementById('score').innerText = this.score;
    document.getElementById('best').innerText = '' + this.bestScore;
  };

  startGame = () => {
    this.isRunning = true;
    this.initKeyDown();
    this.gameLoop();
  };

  resetGame = () => {
    this.gameContainer.removeChild(this.hintContainer);
    this.snake.resetSnake();
    this.food.resetFood();
    this.score = 0;
    this.moveInterval = SPEED;
    document.getElementById('score').innerText = this.score;
    this.createSnake();
    this.createFood();
  };

  createNewSnakeSegment = () => {
    this.food.resetFood();
    this.snake.createNewSnakeSegment();
  };
}
