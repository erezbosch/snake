(function () {
  var SnakeGame = window.SnakeGame = window.SnakeGame || {};

  var Coord = SnakeGame.Coord = function (pos) {
    this.x = pos[0];
    this.y = pos[1];
  };

  Coord.prototype.plus = function (otherCoord) {
    return new Coord([this.x + otherCoord.x, this.y + otherCoord.y]);
  };

  Coord.prototype.equals = function (otherCoord) {
    return this.x === otherCoord.x && this.y === otherCoord.y;
  };

  Coord.prototype.isOpposite = function (otherCoord) {

  };

  var Snake = SnakeGame.Snake = function (initialPos, board) {
    this.board = board;
    this.dir = "N";
    this.segments = [initialPos];
    this.score = 0;
  };

  Snake.DIRS = {
    "N": new SnakeGame.Coord([-1, 0]),
    "E": new SnakeGame.Coord([0, 1]),
    "S": new SnakeGame.Coord([1, 0]),
    "W": new SnakeGame.Coord([0, -1]),
  };

  Snake.prototype.move = function () {
    if (this.dead) { return null; }
    var newSpace = this.segments[0].plus(Snake.DIRS[this.dir]);
    if(this.board.offBoard(newSpace)) {
      this.dead = true;
    } else if(this.includes(newSpace)) {
      this.dead = true;
    } else if (!newSpace.equals(this.board.apple)){
      this.segments.pop();
    }
    this.segments.unshift(newSpace);
    if (newSpace.equals(this.board.apple)) {
      this.board.seedApple();
      this.score++;
    }
  };

  Snake.prototype.turn = function (newDir) {
    this.dir = newDir;
  };

  Snake.prototype.includes = function (coord) {
    for (var i = 0; i < this.segments.length; i++) {
      if (coord.equals(this.segments[i])) {
        return true;
      }
    }
    return false;
  };

  var Board = SnakeGame.Board = function () {
    this.snake = new SnakeGame.Snake(new SnakeGame.Coord([5, 6]), this);
    this.grid = Board.grid([10, 12]);
    this.dims = [10, 12];
    this.seedApple();
  };

  Board.prototype.seedApple = function () {
    do {
      this.apple = new SnakeGame.Coord([
        Math.floor(Math.random() * this.dims[0]),
        Math.floor(Math.random() * this.dims[1])
      ]);
    } while (this.snake.includes(this.apple));
  };

  Board.grid = function(dims) {
    var result = [];
    for (var i = 0; i < dims[0]; i++) {
      result.push([]);
      for (var j = 0; j < dims[1]; j++) {
        result[i].push(new SnakeGame.Coord([i, j]));
      }
    }
    return result;
  };

  Board.prototype.render = function() {
    var str = "";
    for (var i = 0; i < this.grid.length; i++) {
      for (var j = 0; j < this.grid[i].length; j++) {
        if (this.snake.includes(this.grid[i][j])) {
          str += "S ";
        } else {
          str += ". ";
        }
      }
      str += "\n";
    }
    return str;
  };

  Board.prototype.offBoard = function (coord) {
    return (coord.x < 0 || coord.x >= this.dims[0] ||
           coord.y < 0 || coord.y >= this.dims[1]);
  };
})();
