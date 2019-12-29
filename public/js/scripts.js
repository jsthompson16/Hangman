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

const teams = ["Boston Red Sox", "New York Yankees", "Tampa Bay Rays", "Baltimore Orioles", "Toronto Blue Jays",
    "Detroit Tigers", "Chicago White Sox", "Kansas City Royals", "Cleveland Indians", "Minnesota Twins",
    "Houston Astros", "Seattle Mariners", "Oakland Athletics", "Los Angeles Angels", "Texas Rangers",
    "Washington Nationals", "Philadelphia Phillies", "New York Mets", "Atlanta Braves", "Miami Marlins",
    "St Louis Cardinals", "Milwaukee Brewers", "Chicago Cubs", "Cincinnati Reds", "Pittsburgh Pirates",
    "Los Angeles Dodgers", "San Diego Padres", "San Francisco Giants", "Colorado Rockies", "Arizona Diamondbacks"];
let word;
let letterCount = 0;
let lineDistance;
let game;

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

    const canvas = document.getElementById("game-canvas");

    game = new PIXI.Application({
        view: canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        antialias: true
    });

    const lines = new PIXI.Graphics();
    const lineHeight = window.innerHeight * 4 / 5;
    lines.lineStyle(5, 0xB8B4B4, 1);

    word = teams[getRandomInt(30)];
    lineDistance = window.innerWidth / (word.length + 1);
    let currentLinePosition = lineDistance - 15;
    lines.moveTo(currentLinePosition, lineHeight);

    for (let i = 0; i < word.length; i++) {
        if (word[i] !== ' ') {
            lines.lineTo(currentLinePosition + 30, lineHeight);
            letterCount++;
        }
        currentLinePosition += lineDistance;
        lines.moveTo(currentLinePosition, lineHeight);
    }

    game.stage.addChild(lines);
};

document.addEventListener('keypress', function(event) {
    let hasLetter = false;
    for (let i = 0; i < word.length; i++) {
        if (word[i].toLowerCase() === event.key.toLowerCase()) {
            hasLetter = true;
            let letter = new PIXI.Text(word[i],{fontFamily : 'Cambria', fontSize: 45, fill : 0xffffff, align : 'center'});
            if (word[i] === 'l' || word[i] === 'f' || word[i] === 'i' || word[i] === 'I' || word[i] === 'j' ||
                word[i] === 'J' || word[i] === 'r' || word[i] === 't' || word[i] === 's')
                letter.position.x = (i + 1) * lineDistance - 7.5;
            else if (word[i] === 'm')
                letter.position.x = (i + 1) * lineDistance - 17;
            else
                letter.position.x = (i + 1) * lineDistance - 13;
            letter.position.y = ((window.innerHeight * 4) / 5) - 52;
            game.stage.addChild(letter);
        }
    }
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
