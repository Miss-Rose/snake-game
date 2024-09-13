import { createRectangleElement } from './utils.js';
import { COLORS } from './variables.js';

export default class Snake {
  constructor(cellSize, playGroundSize, snakeContainer) {
    this.cellSize = cellSize;
    this.playGroundSize = playGroundSize;
    this.snakeContainer = snakeContainer;

    this.snake = [];
    this.snakeElements = [];
    this.direction = { x: -1, y: 0 };
  }

  createSnake = () => {
    this.snake = [
      {
        x: Math.floor(this.playGroundSize / 2),
        y: Math.floor(this.playGroundSize / 2),
      },
      {
        x: Math.floor(this.playGroundSize / 2) + 1,
        y: Math.floor(this.playGroundSize / 2),
      },
    ];

    this.snake.forEach((segment, index) => {
      const snakeElement = createRectangleElement(
        segment.x,
        segment.y,
        this.cellSize,
        index === 0 ? COLORS.snakeHead : COLORS.snakeBody
      );
      this.snakeContainer.addChild(snakeElement);
      this.snakeElements.push(snakeElement);
    });
  };

  createNewSnakeSegment = () => {
    const tail = this.snake[this.snake.length - 1];
    let newSegmentPos;
    if (this.direction.x === 0) {
      newSegmentPos = {
        x: tail.x,
        y: tail.y + (this.direction.y === -1 ? 1 : -1),
      };
    } else {
      newSegmentPos = {
        x: tail.x + (this.direction.x === -1 ? 1 : -1),
        y: tail.y,
      };
    }
    this.snake.push(newSegmentPos);
    const newSnakeElement = createRectangleElement(
      newSegmentPos.x,
      newSegmentPos.y,
      this.cellSize,
      COLORS.snakeBody
    );
    this.snakeElements.push(newSnakeElement);
    this.snakeContainer.addChild(newSnakeElement);
  };

  resetSnake = () => {
    this.snake = [];
    this.snakeElements = [];
    this.snakeContainer.removeChildren();
    this.direction = { x: -1, y: 0 };
  };
}
