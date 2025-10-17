export interface Vector {
  x: number;
  y: number;
}

export type Paddle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Ball = {
  x: number;
  y: number;
  radius: number;
  speed: Vector;
};

export type Brick = {
  x: number;
  y: number;
  width: number;
  height: number;
  status: number; // 1 - активный, 0 - разрушен
};

// Функция для проверки столкновения по AABB (Axis-Aligned Bounding Box)
export const checkCollisionAABB = (rect1: { x: number; y: number; width: number; height: number }, rect2: { x: number; y: number; width: number; height: number }): boolean => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

// Функция для проверки столкновения мяча с прямоугольником (с учетом радиуса мяча)
export const checkBallCollision = (ball: Ball, rect: { x: number; y: number; width: number; height: number }): boolean => {
  // Находим ближайшую точку на прямоугольнике к центру мяча
  const closestX = Math.max(rect.x, Math.min(ball.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(ball.y, rect.y + rect.height));

  // Вычисляем расстояние между центром мяча и ближайшей точкой
  const distanceX = ball.x - closestX;
  const distanceY = ball.y - closestY;

  // Проверяем, меньше ли расстояние радиуса мяча
  return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
};