const updatePlayer = function(eHP, eSrc, etier) {
    const board = document.getElementById('scoreboard');
    const currtext = document.getElementById('currency-text');
    const lvlref = document.getElementById('level');
    const attref = document.getElementById('attack-cost');
    const critref = document.getElementById('crit-cost');
    let sc = parseInt(board.innerText);
    let go = parseInt(currtext.innerText);
    let lvl = parseInt(lvlref.innerText);
    let att = parseInt(attref.innerText);
    let crt = parseInt(critref.innerText);

    // Add logic here for gamestate and/or score
    const pObj = {
        attack: baseDamage,
        crit: baseCrit,
        level: lvl
    };

    const eObj = {
        health: eHP,
        filepath: eSrc,
        tier: etier
    };

    const currentState = {
        score: sc,
        currency: go,
        PlayerObj: pObj,
        EnemyObj: eObj,
        attackCost: att,
        critCost: crt
    };

    const updatedUser = {
        username: document.getElementById('current-username').value,
        gameState: currentState
    };

    const body = JSON.stringify(updatedUser);
    fetch( '/update', {
        method:'POST',
        body
    })
};

const viewLeaderboard = function() {
    document.getElementById('table').style.display = "flex";
    document.getElementById('back-button').style.display = "flex";
    document.getElementById('leaderboard-button').style.display = "none";
    document.getElementById('game-canvas').style.display = "none";

    fetchLeaderboard();
    return false;
};

const viewGame = function() {
    document.getElementById('table').style.display = "none";
    document.getElementById('back-button').style.display = "none";
    document.getElementById('game-canvas').style.display = "flex";
    document.getElementById('leaderboard-button').style.display = "flex";
};

const fetchLeaderboard = async function() {
    const response = await fetch('/leaderboard', {method: 'GET'});
    const data = await response.json();
    const users = data.users;

    let HTMLDiv = document.getElementById("leaderboard");

    HTMLDiv.innerHTML = '<tr>\n' + '<th>Username</th>\n' +
        '<th>Games Won</th>\n' + '<th>Games Lost</th>\n' + '</tr>';

    for (let i = 0; i < users.length; i++) {
        const currentUser = users[i];
        let row = '<tr>\n';
        row += (`<td> ${currentUser.username} </td>\n`);
        row += (`<td> ${currentUser.gamesWon} </td>\n`);
        row += (`<td> ${currentUser.gamesLost} </td>\n`);
        row += '</tr>';
        HTMLDiv.innerHTML += row;
    }

    return false;
};

const login = function (e) {
    e.preventDefault();

    const loginInfo = {
        username: document.getElementById("login-username").value,
        password: document.getElementById("password").value
    };

    const body = JSON.stringify(loginInfo);
    fetch( '/login', {
        method:'POST',
        body,
        headers: { 'Content-Type': 'application/json' }
    })
    .then( function( response ) {
        document.getElementById('leaderboard-button').style.display = "flex";
        document.getElementById('login').style.display = "none";
        document.getElementById('current-username').value = loginInfo.username;
        pixiInit();
    });
};

const pixiInit = async function () {

    /*
    const username = {
        username: document.getElementById("current-username").value
    };

    const body = JSON.stringify(username);

    const response = await fetch('/getGameState', {
        method: 'POST',
        body
    });
    const data = await response.json();
    const state = data.data;

     */

    const canvas = document.getElementById("game-canvas");

    const game = new PIXI.Application({
        view: canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x333333,
        antialias: true
    });

    const enemyTexture = PIXI.Texture.from("../img/bokoblin.png");
    const enemy = new PIXI.Sprite(enemyTexture);

    enemy.x = (game.renderer.width * 5) / 6;
    enemy.y = game.renderer.height / 2;
    enemy.anchor.x = 0.5;
    enemy.anchor.y = 0.5;

    const playerTexture = PIXI.Texture.from("../img/link.png");
    const player = new PIXI.Sprite(playerTexture);

    player.x = game.renderer.width / 6;
    player.y = game.renderer.height / 2;
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;

    game.stage.addChild(enemy);
    game.stage.addChild(player);

    //let damageText = new PIXI.Text('0',{fontFamily : 'Arial', fontSize: 24, fill : 0xff0030, align : 'center'});

};

