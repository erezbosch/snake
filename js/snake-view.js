(function () {
  var SnakeGame = window.SnakeGame = window.SnakeGame || {};
  var View = SnakeGame.View = function ($el) {
    this.board = new SnakeGame.Board();
    this.$el = $el;
    this.setupBoard();
    this.bindEvents();
    this.survivalTime = 0;
    this.render();
    this.intervalId = window.setInterval(function () {
      this.step();
    }.bind(this), 200);
  };

  View.prototype.step = function () {
    this.board.snake.move();
    this.render();
    this.survivalTime += 0.2;
    if (this.board.snake.dead) {
      var $hs = $("ol");
      $hs.append($("<li class='game-over high-scores'>"
        + this.board.snake.score + "</li>"));
      this.sortScores();
      $(".game-over").addClass("true");
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  };

  View.prototype.bindEvents = function () {
    $(document).keydown(function (event) {
      var dir = SnakeGame.View.handleKeyEvent(event);
      if (["N", "W", "E", "S"].indexOf(dir) !== -1) {
        this.board.snake.turn(dir);
      } else if (dir === "pause" && this.intervalId !== null) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      } else if (dir === "pause" && this.intervalId === null) {
        this.intervalId = window.setInterval(function () {
          this.step();
        }.bind(this), 200);
      } else if (dir === "restart") {
        $("figure :not(.high-scores)").detach();
        $("figure *").removeClass("true");
        this.board = new SnakeGame.Board();
        this.setupBoard();
        this.survivalTime = 0;
        this.render();
        if (this.intervalId === null) {
          this.intervalId = window.setInterval(function () {
            this.step();
          }.bind(this), 200);
        }
      }
    }.bind(this));
  };

  View.prototype.setupBoard = function () {
    this.$el.append("<div class='info'>W-A-S-D to move </div>");
    this.$el.append("<h1>SNAKE</h1>");
    this.$el.append("<div class='info'> P to pause/resume</div>");
    this.$el.append($("<pre class='score'></pre>"));
    for (var i = 0; i < this.board.dims[0]; i++) {
      var $row = $("<ul class='row group'></ul>").attr("data-row", i);
      this.$el.append($row);
      for (var j = 0; j < this.board.dims[1]; j++) {
        var $space = $("<li class='space'></li>")
                      .attr("data-row", i)
                      .attr("data-col", j);
        $row.append($space);
      }
    }
    this.$el.append("<div class='game-over'>N to restart </div>");
    this.$el.append("<h1 class='game-over'>GAME OVER</h1>");
    this.$el.append("<div class='game-over'> Scroll down for high scores</div>");
    this.sortScores();
  };

  View.prototype.sortScores = function () {
    var scores = [];
    if ($("ol").length) {
      for (var i = 0; i < $("ol li").length; i++) {
        scores.push(parseInt($("ol li")[i].textContent));
      }
      scores.sort(function (a, b) {
        return b - a;
      });
      $("ol").remove();
    }
    var $hs = $("<ol class='game-over high-scores'></ol>");
    this.$el.append($hs);
    for (var i = 0; i < scores.length; i++) {
      $hs.append($("<li class='game-over high-scores'>" + scores[i] + "</li>"));
    }
  }

  View.handleKeyEvent = function (event) {
    var keyPressed = event.keyCode;
    if (keyPressed === 87) { return "N"; }
    if (keyPressed === 65) { return "W"; }
    if (keyPressed === 68) { return "E"; }
    if (keyPressed === 83) { return "S"; }
    if (keyPressed === 80) { return "pause"; }
    if (keyPressed === 78) { return "restart"; }
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
