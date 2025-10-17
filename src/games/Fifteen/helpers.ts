import { GameState } from './types';

/**
 * Инициализирует игровое поле 4x4 с перемешанными плитками
 * @returns Массив из 16 элементов, где 15 - числа от 1 до 15, и один null (пустая плитка)
 */
export const initializeBoard = (): (number | null)[] => {
  const tiles: (number | null)[] = Array.from({ length: 15 }, (_, i) => i + 1);
  tiles.push(null); // Пустая плитка
  
  // Перемешиваем плитки
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  
  return tiles;
};

/**
 * Проверяет, можно ли переместить плитку в указанную позицию
 * @param board Текущее состояние игрового поля
 * @param index Индекс плитки, которую хотим переместить
 * @returns true, если ход возможен, иначе false
 */
export const canMoveTile = (board: (number | null)[], index: number): boolean => {
  const emptyIndex = board.indexOf(null);
  const row = Math.floor(index / 4);
  const col = index % 4;
  const emptyRow = Math.floor(emptyIndex / 4);
  const emptyCol = emptyIndex % 4;

  // Проверяем, находится ли плитка рядом с пустой ячейкой
  return (
    (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
    (Math.abs(col - emptyCol) === 1 && row === emptyRow)
  );
};

/**
 * Проверяет, достигнута ли победа (все плитки по порядку)
 * @param board Текущее состояние игрового поля
 * @returns true, если игра выиграна, иначе false
 */
export const checkWin = (board: (number | null)[]): boolean => {
  // Проверяем, что первые 15 элементов идут по порядку, а последний - пустой
  for (let i = 0; i < 15; i++) {
    if (board[i] !== i + 1) {
      return false;
    }
  }
  return board[15] === null;
};

/**
 * Обновляет состояние игры после хода
 * @param gameState Текущее состояние игры
 * @param index Индекс плитки, которую перемещаем
 * @returns Новое состояние игры
 */
export const makeMove = (gameState: GameState, index: number): GameState => {
  if (!canMoveTile(gameState.board, index)) {
    return gameState;
  }

  const newBoard = [...gameState.board];
 const emptyIndex = newBoard.indexOf(null);
  
  // Меняем местами плитку и пустое место
  [newBoard[index], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[index]];
  
  const isWin = checkWin(newBoard);
  
  return {
    ...gameState,
    board: newBoard,
    moves: gameState.moves + 1,
    isGameOver: isWin
  };
};