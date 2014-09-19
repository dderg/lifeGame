var sizeX = 0;
var sizeY = 0;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
var curState;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 100;

function addSquare(x, y, name) {
    var geometry = new THREE.BoxGeometry(1, 1, 0);
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.x = x;
    cube.position.y = y;
    cube.name = name;
    cube.active = false;
    scene.add(cube);

}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

function makeTable(i, j) {
    var x = 0;
    for (var k = -i / 2; k < i / 2; k++) {
        var y = 0;
        for (var m = -j / 2; m < j / 2; m++) {
            addSquare(k, m, x + '_' + y);
            y++;
        }
        x++;
    }
    sizeX = i;
    sizeY = j;
    render();
}

function outputObjects() {
    console.log(scene.children);
}

function getState() {
    var arr = [];
    for (var i = 0; i < sizeX; i++) {
        arr[i] = [];
        for (var j = 0; j < sizeY; j++) {
            arr[i][j] = (scene.getObjectByName(i + '_' + j).active);
        }
    }
    return arr;
}

function setRandom() {
    var state;
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            state = (Math.random() > 0.6);
            scene.getObjectByName(i + '_' + j).active = state;
        }
    }
}

function renderState(arr) {
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            /*if (arr[i][j]) {
                scene.getObjectByName(i + '_' + j).material.color.setRGB(1, 1, 1);
            } else {
                scene.getObjectByName(i + '_' + j).material.color.setRGB(0, 0, 0);
            }*/
            scene.getObjectByName(i + '_' + j).visible = arr[i][j];
        }
    }
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
    return next;
}

makeTable(100, 100);
setRandom();
curState = getState();
//renderState(curState);
//outputObjects();

setInterval(function () {
    renderState(curState);
    curState = getNextState(curState);
}, 100);

