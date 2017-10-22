var targets = [];

function createArray() {
    return [];
}

function clearArray(xs) {
    xs.splice(0, xs.length);
}

function emptyEnemy() {
    enemies = [];
    targets = [];
}

function createPlanarEnemy(n) {
    for (var i = 0; i < n; i = i + 1) {
        enemies[i] = [i, Math.random() * 10 + 1];
    }
}

function enemySize() {
    return enemies.length;
}

function getPlanarAngle(enemy) {
    return enemy[1];
}

function addTargets(xs) {
    for (var i = 0; i < xs.length; i = i + 1) {
        targets[i] = xs[i];
    }
}

function getTargets() {
    return targets;
}

function printEnemies(enemies) {
  return JSON.stringify(enemies);
}