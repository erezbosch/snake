(function () {
  var SnakeGame = window.SnakeGame = window.SnakeGame || {};
  var View = SnakeGame.View = function ($el) {
    this.board = new SnakeGame.Board();
    this.$el = $el;
    this.setupBoard();
    this.bindEvents();
    this.render();
    this.survivalTime = 0;
    this.intervalId = window.setInterval(function () {
      this.step();
    }.bind(this), 200);
  };

  View.prototype.step = function () {
    this.board.snake.move();
    this.render();
    this.survivalTime += 0.2;
    if (this.board.snake.dead) {
      this.$el.addClass("game-over");
      clearInterval(this.intervalId);
    }
  };

  View.prototype.bindEvents = function () {
    $(document).keydown(function (event) {
      var dir = SnakeGame.View.handleKeyEvent(event);
      if (["N", "W", "E", "S"].indexOf(dir) !== -1) {
        this.board.snake.turn(dir);
      } else if (dir === "pause") {
        clearInterval(this.intervalId);
        this.intervalId = null;
      } else if (dir === "resume" && this.intervalId === null) {
        this.intervalId = window.setInterval(function () {
          this.step();
        }.bind(this), 200);
      }
      // else if (dir === "restart") {
      //   this.$el.empty();
      // }
    }.bind(this));
  };

  View.prototype.setupBoard = function () {
    this.$el.append("<div class='info'>W-A-S-D to move </div>");
    this.$el.append("<h1>SNAKE</h1>");
    this.$el.append("<div class='info'> P to pause/resume</div>");
    this.$el.append($("<pre class='score'></pre>"));
    for (var i = 0; i < this.board.dims[0]; i++) {
      var $row = $("<ul class='group'></ul>").attr("data-row", i);
      this.$el.append($row);
      for (var j = 0; j < this.board.dims[1]; j++) {
        var $space = $("<li></li>").attr("data-row", i).attr("data-col", j);
        $row.append($space);
      }
    }
  };

  View.handleKeyEvent = function (event) {
    var keyPressed = event.keyCode;
    if (keyPressed === 87) { return "N"; }
    if (keyPressed === 65) { return "W"; }
    if (keyPressed === 68) { return "E"; }
    if (keyPressed === 83) { return "S"; }
    if (keyPressed === 80) { return "pause"; }
    if (keyPressed === 82) { return "resume"; }
    if (keyPressed === 77) { return "restart"; }
    return null;
  };

  View.prototype.render = function () {
    $(".score").text("Time: " + Math.floor(this.survivalTime)
      + "    Score: " + this.board.snake.score);
    for (var i = 0; i < this.board.dims[0]; i++) {
      for (var j = 0; j < this.board.dims[1]; j++) {
        var $space = $("li[data-row=" + i +
                       "][data-col=" + j + "]");

        if (this.board.snake.includes(new SnakeGame.Coord([i, j]))) {
          $space.addClass("occupied").removeClass("apple");
        } else if (this.board.apple.equals(new SnakeGame.Coord([i, j]))) {
          $space.addClass("apple");
        } else {
          $space.removeClass("occupied").removeClass("apple");
        }
      }
    }
  };
})();
