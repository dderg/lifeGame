$(function () {
    var game = $('#game');
    var state = [];

    function buildRow(i) {
        game.append('<div class="row row' + i + '"></div>');
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
                if ($(this).hasClass('active')) {
                    arr[i][j] = true;
                } else {
                    arr[i][j] = false;
                }
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

    $('#makeTable').click(function () {
        buildTable(400, 200);
    });

    $('#nextstate').click(startGame);
    $('#random').click(makeRandom);
    $('#stop').click(function () {
        play = false;
    });
});