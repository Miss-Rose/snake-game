import { Graphics } from 'pixi.js';

export const createRectangleElement = (x, y, cellSize, color) => {
  const element = new Graphics();
  element.rect(0, 0, cellSize, cellSize);
  element.fill(color);
  element.stroke({ width: 1, color: 0x000000 });
  element.x = x * cellSize;
  element.y = y * cellSize;
  return element;
};
