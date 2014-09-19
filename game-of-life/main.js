$(function () {
    var Game, game;

    Game = function (x, y) {
        this.sizeX = +x;
        this.sizeY = +y;
        this.state = new Array(this.sizeX);
        var objArr = new Array(this.sizeX);
        this.next = new Array(this.sizeX);
        for (var i = 0; i < this.sizeX; i++) {
            this.state[i] = new Array(this.sizeY);
            objArr[i] = new Array(this.sizeY);
            this.next[i] = new Array(this.sizeY);
            for (var j = 0; j < this.sizeY; j++) {
                this.state[i][j] = false;
                this.next[i][j] = false;
            }
        }
        this.objArr = objArr;
    };
    Game.prototype.wrapper = $('#game');
    Game.prototype.createTable = function () {
        var game = this, i, j;
        for (i = 0; i < game.sizeY; i++) {
            this.wrapper.append('<div class="row row' + i + '"></div>');

        }
        var rowCount = 0;

        $('.row').each(function () {
            var rowCells = '';
            for (j = 0; j < game.sizeX; j++) {
                rowCells += '<div class="cell" id="c_' + rowCount + '_' + j + '"></div>';
            }
            $(this).append(rowCells);
            rowCount++;
        });
        for (i = 0; i < game.sizeX; i++) {
            for (j = 0; j < game.sizeY; j++) {
                game.objArr[i][j] = $('#c_' + i + '_' + j);
            }
        }
        console.log(game.objArr);
        $('.cell').click(function () {
            $(this).toggleClass('active');
            var arr = $(this).attr('id').split("_");
            game.state[arr[1]][arr[2]] = (game.state[arr[1]][arr[2]] ? false : true);
        });
    };
    Game.prototype.nextState = function () {
        var next = [];
        var i = 0;
        for (i = 0; i < this.sizeX; i++) {
            next[i] = [];
            for (var j = 0; j < this.sizeY; j++) {
                var neighCount = 0;
                for (var k = i - 1; k <= i + 1; k++) {
                    if (k >= 0 && k < this.sizeX) {
                        for (var m = j - 1; m <= j + 1; m++) {
                            if (m >= 0 && m < this.sizeY) {
                                if (this.state[k][m]) neighCount++;
                            }
                        }
                    }
                }
                if (this.state[i][j]) {
                    neighCount--;
                    next[i][j] = (neighCount == 3 || neighCount == 2);
                } else {
                    next[i][j] = (neighCount == 3);
                }
            }
        }
        this.render(next);


        this.state = next;

    };
    Game.prototype.render = function (next) {
        for (var x = 0; x < this.sizeX; x++) {
            for (var y = 0; y < this.sizeY; y++) {
                if (next[x][y] != this.state[x][y]) {
                    if (next[x][y]) {
                        this.objArr[x][y].addClass('active');
                    } else {
                        this.objArr[x][y].removeClass('active');
                    }
                }
            }
        }
    };

    game = new Game(400, 200);

    $('#makeTable').click(function () {
        game.createTable(400, 200);
    });
    $('#nextstate').click(function () {
        setInterval(function () {
            game.nextState();
        }, 50);
    });
    /*
     var gameDiv = $('#game');

     function buildRow(i) {
     gameDiv.append('<div class="row row' + i + '"></div>');
     }

     function buildTable(sizeX, sizeY) {
     for (var i = 0; i < sizeY; i++) {
     buildRow(i);
     }
     var rowCount = 0;
     $('.row').each(function () {
     var rowCells = '';
     for (var j = 0; j < sizeX; j++) {
     rowCells += '<div class="cell" id="c_' + j + '_' + rowCount + '"></div>';
     }
     $(this).append(rowCells);
     rowCount++;
     });


     $('.cell').click(function () {
     $(this).toggleClass('active');
     });
     }


     function getStartState() {
     var arr = [];
     var row = $('.row');
     var i = 0;
     row.each(function () {
     arr[i] = [];
     var j = 0;

     $(this).find('.cell').each(function () {
     arr[i][j] = ($(this).hasClass('active'));
     j++;
     });
     i++;
     });
     return arr;
     }

     function getNextState(now) {
     var next = [];

     for (var i = 0; i < now.length; i++) {
     next[i] = [];
     for (var j = 0; j < now[i].length; j++) {
     var neighCount = 0;
     for (var k = i - 1; k <= i + 1; k++) {
     if (k >= 0 && k < now.length) {
     for (var m = j - 1; m <= j + 1; m++) {
     if (m >= 0 && m < now[k].length) {
     if (now[k][m]) neighCount++;
     }
     }
     }
     }
     if (now[i][j]) {
     neighCount--;
     next[i][j] = (neighCount == 3 || neighCount == 2);
     } else {
     next[i][j] = (neighCount == 3);
     }
     }
     }
     for (var x = 0; x < next.length; x++) {
     for (var y = 0; y < next[x].length; y++) {
     var cell = $('#c_' + y + '_' + x);
     cell.removeClass('active');
     if (next[x][y]) {
     cell.addClass('active');
     }
     }
     }
     return next;
     }


     var play = true;

     function startGame() {
     var arr = getStartState();
     step(arr);
     function step(arr) {
     var next = getNextState(arr);
     setTimeout(function () {
     step(next);
     }, 50);
     }
     }

     function makeRandom() {
     $('.cell').each(function () {
     if (Math.random() > .6) {
     $(this).addClass('active');
     }
     })
     }

     */
    /*$('#makeTable').click(function () {
     buildTable(400, 200);
     });*/
    /*

     $('#nextstate').click(startGame);
     $('#random').click(makeRandom);
     $('#stop').click(function () {
     play = false;
     });*/
});