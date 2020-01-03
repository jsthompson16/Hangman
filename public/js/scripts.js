
const teams = ["Boston Red Sox", "New York Yankees", "Tampa Bay Rays", "Baltimore Orioles", "Toronto Blue Jays",
    "Detroit Tigers", "Chicago White Sox", "Kansas City Royals", "Cleveland Indians", "Minnesota Twins",
    "Houston Astros", "Seattle Mariners", "Oakland Athletics", "Los Angeles Angels", "Texas Rangers",
    "Washington Nationals", "Philadelphia Phillies", "New York Mets", "Atlanta Braves", "Miami Marlins",
    "St Louis Cardinals", "Milwaukee Brewers", "Chicago Cubs", "Cincinnati Reds", "Pittsburgh Pirates",
    "Los Angeles Dodgers", "San Diego Padres", "San Francisco Giants", "Colorado Rockies", "Arizona Diamondbacks"];
let word;
let numLetters = 0;
let numFoundLetters = 0;
let foundLetters = [];
let incorrectGuesses = 0;
let incorrectLetters = [];
let lineDistance;
let game;

const updatePlayer = function(gamesWon, gamesLost) {

    const updatedUser = {
        username: document.getElementById('current-username').value,
        gamesWon: gamesWon,
        gamesLost: gamesLost
    };

    const body = JSON.stringify(updatedUser);
    fetch( '/update', {
        method:'POST',
        body
    })
};

const resetGame = function() {
    document.getElementById('new-game-button').style.display = "none";

    if (incorrectGuesses === 10)
        updatePlayer(0, 1);
    else
        updatePlayer(1, 0);

    word = '';
    numLetters = 0;
    numFoundLetters = 0;
    foundLetters = [];
    incorrectGuesses = 0;
    incorrectLetters = [];
    lineDistance = 0;
    game.destroy();

    pixiInit();
};

const viewLeaderboard = function() {
    document.getElementById('table').style.display = "flex";
    document.getElementById('back-button').style.display = "flex";
    document.getElementById('leaderboard-button').style.display = "none";
    document.getElementById('game-canvas').style.display = "none";
    document.getElementById('new-game-button').style.display = "none";

    fetchLeaderboard();
    return false;
};

const viewGame = function() {
    document.getElementById('table').style.display = "none";
    document.getElementById('back-button').style.display = "none";
    document.getElementById('game-canvas').style.display = "flex";
    document.getElementById('leaderboard-button').style.display = "flex";

    if (numLetters === numFoundLetters || incorrectGuesses === 10)
        document.getElementById('new-game-button').style.display = "flex";
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
            numLetters++;
        }
        currentLinePosition += lineDistance;
        lines.moveTo(currentLinePosition, lineHeight);
    }

    game.stage.addChild(lines);

    let guesses = new PIXI.Text("Incorrect Guesses:", {
        fontFamily: 'Cambria',
        fontSize: 30,
        fill: 0xffffff,
        align: 'center'
    });
    guesses.position.x = window.innerWidth / 4;
    guesses.position.y = window.innerHeight - 85;
    game.stage.addChild(guesses);
};

document.addEventListener('keypress', function(event) {
    let foundALetter = false;
    let alreadyGuessedLetter = false;

    for (let j = 0; j < foundLetters.length; j++) {
        if (foundLetters[j].toLowerCase() === event.key.toLowerCase())
            alreadyGuessedLetter = true;
    }

    for (let k = 0; k < incorrectLetters.length; k++) {
        if (incorrectLetters[k].toLowerCase() === event.key.toLowerCase())
            alreadyGuessedLetter = true;
    }

    if (!alreadyGuessedLetter) {
        for (let i = 0; i < word.length; i++) {
            if (word[i].toLowerCase() === event.key.toLowerCase()) {
                numFoundLetters++;
                foundLetters.push(word[i]);
                foundALetter = true;
                let letter = new PIXI.Text(word[i], {
                    fontFamily: 'Cambria',
                    fontSize: 45,
                    fill: 0xffffff,
                    align: 'center'
                });
                if (word[i] === 'l' || word[i] === 'f' || word[i] === 'i' || word[i] === 'I' || word[i] === 'j' ||
                    word[i] === 'J' || word[i] === 'r' || word[i] === 't' || word[i] === 's')
                    letter.position.x = (i + 1) * lineDistance - 7.5;
                else if (word[i] === 'm' || word[i] === 'M')
                    letter.position.x = (i + 1) * lineDistance - 17;
                else
                    letter.position.x = (i + 1) * lineDistance - 13;
                letter.position.y = ((window.innerHeight * 4) / 5) - 52;
                game.stage.addChild(letter);

                if (numLetters === numFoundLetters) {
                    let win = new PIXI.Text("You won!", {
                        fontFamily: 'Cambria',
                        fontSize: 30,
                        fill: 0xffffff,
                        align: 'center'
                    });
                    win.position.x = window.innerWidth / 2 + 200;
                    win.position.y = window.innerHeight / 2 - 75;
                    game.stage.addChild(win);
                    document.getElementById('new-game-button').style.display = "flex";
                }
            }
        }

        if (!foundALetter) {
            let hangman = new PIXI.Graphics();
            hangman.lineStyle(5, 0xB8B4B4, 1);
            switch (incorrectGuesses) {
                case 0:
                    hangman.moveTo(200, window.innerHeight / 2 + 100);
                    hangman.lineTo(400, window.innerHeight / 2 + 100);
                    break;
                case 1:
                    hangman.moveTo(350, window.innerHeight / 2 + 100);
                    hangman.lineTo(350, window.innerHeight / 3 - 70);
                    break;
                case 2:
                    hangman.moveTo(350, window.innerHeight / 3 - 70);
                    hangman.lineTo(275, window.innerHeight / 3 - 70);
                    break;
                case 3:
                    hangman.moveTo(275, window.innerHeight / 3 - 70);
                    hangman.lineTo(275, window.innerHeight / 3 - 20);
                    break;
                case 4:
                    hangman.moveTo(275, window.innerHeight / 3 - 20);
                    hangman.drawCircle(275, window.innerHeight / 3, 20);
                    break;
                case 5:
                    hangman.moveTo(275, window.innerHeight / 3 + 20);
                    hangman.lineTo(275, window.innerHeight / 2);
                    break;
                case 6:
                    hangman.moveTo(275, window.innerHeight / 2);
                    hangman.lineTo(300, window.innerHeight / 2 + 60);
                    break;
                case 7:
                    hangman.moveTo(275, window.innerHeight / 2);
                    hangman.lineTo(250, window.innerHeight / 2 + 60);
                    break;
                case 8:
                    hangman.moveTo(275, window.innerHeight / 2 - 30);
                    hangman.lineTo(310, window.innerHeight / 2 - 90);
                    break;
                case 9:
                    hangman.moveTo(275, window.innerHeight / 2 - 30);
                    hangman.lineTo(240, window.innerHeight / 2 - 90);
                    break;
                default:
                    console.log("This shouldn't happen");
                    break;
            }

            game.stage.addChild(hangman);
            incorrectGuesses++;
            incorrectLetters.push(event.key.toLowerCase());

            let incorrectLetter = new PIXI.Text(event.key.toLowerCase(), {
                fontFamily: 'Cambria',
                fontSize: 30,
                fill: 0xffffff,
                align: 'center'
            });
            incorrectLetter.position.x = window.innerWidth * 2 / 5 - 20 + (40 * incorrectGuesses);
            incorrectLetter.position.y = window.innerHeight - 85;
            game.stage.addChild(incorrectLetter);

            if (incorrectGuesses === 10) {
                let loss = new PIXI.Text("You lost.", {
                    fontFamily: 'Cambria',
                    fontSize: 30,
                    fill: 0xffffff,
                    align: 'center'
                });
                loss.position.x = window.innerWidth / 2 + 200;
                loss.position.y = window.innerHeight / 2 - 75;
                game.stage.addChild(loss);
                document.getElementById('new-game-button').style.display = "flex";
            }
        }
    }
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
