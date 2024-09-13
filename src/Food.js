import { createRectangleElement } from './utils.js';
import { COLORS } from './variables.js';

export default class Food {
  constructor(cellSize, playGroundSize, foodContainer) {
    this.cellSize = cellSize;
    this.playGroundSize = playGroundSize;
    this.foodContainer = foodContainer;
  }

  createFoodElement = (snake) => {
    let foodX, foodY;
    do {
      foodX = Math.floor(Math.random() * this.playGroundSize);
      foodY = Math.floor(Math.random() * this.playGroundSize);
    } while (
      snake.some((segment) => segment.x === foodX && segment.y === foodY)
    );

    this.foodCoords = { x: foodX, y: foodY };
    this.foodElement = createRectangleElement(
      this.foodCoords.x,
      this.foodCoords.y,
      this.cellSize,
      COLORS.food
    );
    this.foodContainer.addChild(this.foodElement);
  };

  resetFood = () => {
    this.foodContainer.removeChildren();
  };
}
