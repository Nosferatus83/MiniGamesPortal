class Wall {
  static R = 2;
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Food {
  static R = 2;
  x: number;
  y: number;
  type: 'food' | 'superfood';

  constructor(x: number, y: number, type: 'food' | 'superfood' = 'food') {
    this.x = x;
    this.y = y;
    this.type = type;
  }
}

export class Empty {
 x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Level {
  width: number;
  height: number;
  grid: (Wall | Food | Empty)[][];
  foodCount: number = 0;

  map = [
    '###################',
    '#........#........#',
    '#o##.###.#.###.##o#',
    '#.................#',
    '#.##.#.#####.#.##.#',
    '#....#...#...#....#',
    '####.### # ###.####',
    '   #.#   0   #.#   ',
    '####.# ##### #.####',
    '#....#...#...#....#',
    '#.##.#.#####.#.##.#',
    '#.................#',
    '#o##.###.#.###.##o#',
    '#........#........#',
    '###################',
  ];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.grid = [];
    this.parse();
  }

  parse() {
    for (let y = 0; y < this.map.length; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.map[y].length; x++) {
        let char = this.map[y][x];
        if (char === '#') {
          this.grid[y][x] = new Wall(x, y);
        } else if (char === '.') {
          this.grid[y][x] = new Food(x, y, 'food');
          this.foodCount++;
        } else if (char === 'o') {
          this.grid[y][x] = new Food(x, y, 'superfood');
          this.foodCount++;
        } else {
          this.grid[y][x] = new Empty(x, y);
        }
      }
    }
  }

  get(x: number, y: number) {
    return this.grid[y] && this.grid[y][x];
  }
}