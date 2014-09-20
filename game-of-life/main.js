$(function () {
    'use strict';
    var Game, game;

    Game = function (x, y, speed) {
        this.sizeX = +x;
        this.sizeY = +y;
        this.state = new Array(this.sizeX);
        this.isTableSet = false;
        this.objArr = new Array(this.sizeX);
        this.neght = new Array(this.sizeX);
        this.isGameGoing = false;

        for (var i = 0; i < this.sizeX; i++) {
            this.state[i] = new Array(this.sizeY);
            this.neght[i] = new Array(this.sizeY);

            this.objArr[i] = new Array(this.sizeY);
            for (var j = 0; j < this.sizeY; j++) {
                this.state[i][j] = false;
                this.neght[i][j] = 1;

            }
        }
        var game = this;
        setInterval(function(){
            if(game.isGameGoing){
                game.nextState();
            }
        },speed);
    };
    Game.prototype.wrapper = $('#game');
    Game.prototype.createTable = function () {
        var game = this, i, j;
        for (i = 0; i < game.sizeX; i++) {
            this.wrapper.append('<div class="r"></div>');
        }
        var rowCount = 0;

        $('.r').each(function () {
            for (j = 0; j < game.sizeY; j++) {
                $(this).append('<div class="c" id="c_' + rowCount + '_' + j + '"></div>');
            }
            rowCount++;
        });
        for (i = 0; i < game.sizeX; i++) {
            for (j = 0; j < game.sizeY; j++) {
                game.objArr[i][j] = $('#c_' + i + '_' + j);
            }
        }
        $('.c').click(function () {
            $(this).toggleClass('a');
            var arr = $(this).attr('id').split("_");
            game.state[arr[1]][arr[2]] = (game.state[arr[1]][arr[2]] ? false : true);
        });
        this.isTableSet = true;
    };
    Game.prototype.nextState = function () {
        var next = [];
        var i, j, k, m;
        for (i = 0; i < this.sizeX; i++) {
            next[i] = [];
            for (j = 0; j < this.sizeY; j++) {

                this.neght[i][j] = 0;
                for (k = i - 1; k <= i + 1; k++) {
                    if (k >= 0 && k < this.sizeX) {
                        for (m = j - 1; m <= j + 1; m++) {
                            if (m >= 0 && m < this.sizeY) {
                                if (this.state[k][m]) this.neght[i][j]++;
                            }
                        }
                    }
                }
                if (this.state[i][j]) {
                    next[i][j] = (this.neght[i][j] == 3 || this.neght[i][j] == 4);
                } else {
                    next[i][j] = (this.neght[i][j] == 3);
                }
            }
        }
        this.render(next);
        this.state = next;

    };
    Game.prototype.render = function (next) {
        this.isGameGoing = false;
        for (var x = 0; x < this.sizeX; x++) {
            for (var y = 0; y < this.sizeY; y++) {
                if (next[x][y] != this.state[x][y]) {
                    this.isGameGoing = true;
                    if (next[x][y]) {
                        this.objArr[x][y].addClass('a');
                    } else {
                        this.objArr[x][y].removeClass('a');
                    }
                }
            }
        }
    };
    Game.prototype.random = function () {
        if (!this.isTableSet) this.createTable();
        for (var i = 0; i < this.sizeX; i++) {
            for (var j = 0; j < this.sizeY; j++) {
                if (Math.random() > .7) {
                    this.state[i][j] = true;
                    this.objArr[i][j].addClass('a');
                }
            }
        }
    };
    Game.prototype.stop = function () {
        this.isGameGoing = false;
    };
    Game.prototype.start = function(){
        this.isGameGoing = true;
    };
    Game.prototype.clear = function(){
        var state = [];
        for (var i = 0; i<this.sizeX; i++){
            state[i] = [];
            for (var j = 0; j<this.sizeY; j++){
                state[i][j] = false;
            }
        }
        this.render(state);
        this.state=state;
    };
    Game.prototype.send = function(){
        if (!this.isTableSet) {alert('поле не задано')} else {
            var jsonString = JSON.stringify(this.state);
            var name = $('#name').val();
            $.post('write.php', {name: name, arr: jsonString});
        }
    };
    Game.prototype.get = function(){
        if (!this.isTableSet) this.createTable();
        var name = $('#name').val();
        var game = this;
        $.post('read.php',{name: name},function(data){
            var state=JSON.parse(data);
            game.render(state);
            game.state = state;
            game.isGameGoing = false;
        });

    };

    game = new Game(100, 100, 0);

    $('#makeTable').click(function () {
        game.createTable();
    });
    $('#nextstate').click(function () {
        game.start();
    });
    $('#random').click(function () {
        game.random();
    });
    $('#stop').click(function(){
        game.stop();
    });
    $('#clear').click(function(){
        game.clear();
    });
    $('#send').click(function(){
        game.send();
    });
    $('#get').click(function(){
        game.get();
    })

});