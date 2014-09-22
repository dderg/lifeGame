window.onload =function(){
    'use strict';
    var Game, game;

    Game = function (x, y, speed) {
        this.sizeX = +x;
        this.sizeY = +y;
        this.state = [];
        this.isTableSet = false;
        this.objArr = [];
        this.neght = [];
        this.isGameGoing = false;
        for (var i = 0; i < this.sizeX; i++) {
            this.state[i] = [];
            this.neght[i] = [];
            this.objArr[i] = [];
            for (var j = 0; j < this.sizeY; j++) {
                this.state[i][j] = false;
                this.neght[i][j] = 1;
            }
        }
        this.getList();
        var game = this;
        setInterval(function(){
            if(game.isGameGoing){
                game.nextState();
            }
        },speed);
    };
    Game.prototype.wrapper = document.getElementById('game');
    Game.prototype.createTable = function () {
        var game = this,i, j;
        game.removeTable();
        for (i = 0; i < game.sizeX; i++) {
            var row = document.createElement('div');
            row.className = 'r';
            this.wrapper.appendChild(row);
            for (j = 0; j < game.sizeY; j++) {
                var cell = document.createElement('div');
                cell.className = 'c';
                cell.id = 'c_'+i+'_'+j;
                row.appendChild(cell);
                this.objArr[i][j] = cell;
                cell.onclick = function(){
                    var arr = this.id.split("_");
                    var x = arr[1];
                    var y = arr[2];
                    if(game.state[x][y]){
                        this.style.backgroundColor = '#000';
                        //this.removeAttribute('style'); // not sure what's faster
                        game.state[x][y] = false;
                    } else {
                        this.style.backgroundColor = '#fff';
                        game.state[x][y] = true;
                    }
                };
            }
        }
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
                        this.objArr[x][y].style.backgroundColor='#fff';
                    } else {
                        this.objArr[x][y].style.backgroundColor='#000';
                        //this.objArr[x][y].removeAttribute('style'); not sure what's faster
                    }
                }
            }
        }
    };
    Game.prototype.getList = function(){
        var game = this;
        $.get('list.txt',function(data){
            data = data.substring(0, data.length - 1);
            var arr = data.split(',');
            game.list = document.createElement('div');
            game.list.className = 'list';
            document.body.appendChild(game.list);
            for(var i = 0; i<arr.length; i++){
                game.addListElem(arr[i]);
            }
        });
    };
    Game.prototype.addListElem = function(text){
        var elem = document.createElement('div');
        elem.innerHTML = text;
        elem.className = 'list__elem';
        game.list.appendChild(elem);
        elem.onclick = function(){
            game.get(this.innerHTML);
        }
    };
    Game.prototype.changeSize = function(x,y){
        this.sizeX = x;
        this.sizeY = y;
    };
    Game.prototype.removeTable = function(){
        this.wrapper.innerHTML = '';
        this.isTableSet = false;
    };
    Game.prototype.random = function () {
        if (!this.isTableSet) this.createTable();
        for (var i = 0; i < this.sizeX; i++) {
            for (var j = 0; j < this.sizeY; j++) {
                if (Math.random() > .7) {
                    this.state[i][j] = true;
                    this.objArr[i][j].style.backgroundColor='#fff';
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
        var game = this;
        if (!this.isTableSet) {alert('поле не задано')} else {
            var jsonString = JSON.stringify(this.state);
            var name = $('#name').val();
            $.post('write.php', {name: name, arr: jsonString},function(data){
                game.addListElem(data);
            });
        }
    };
    Game.prototype.updateTable = function(x,y){
        game.changeSize(x,y);
        game.createTable();
    };
    Game.prototype.get = function(name){
        if (this.isTableSet) this.removeTable();
        var game = this;
        $.post('read.php',{name: name},function(data){
            var state=JSON.parse(data);
            game.updateTable(state.length,state[0].length);
            game.render(state);
            game.state = state;
            game.stop();
        });

    };
    Game.prototype.addController = function(func,text){
        var game = this;
        var btn = document.createElement('button');
        btn.innerHTML = text;
        btn.onclick = function(){
            game[func]();
        };
        document.body.appendChild(btn);
    };

    game = new Game(250, 250, 0);

    game.addController("createTable","Создать поле");
    game.addController("random","Заполнить случайно");
    game.addController("start","Старт");
    game.addController("stop","Стоп");
    game.addController("clear","Очистить поле");
    game.addController("send","Сохранить состояние");
    game.addController("get","Загрузить по названию файла");

};