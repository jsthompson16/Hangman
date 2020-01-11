let assert = require('assert'),
    mocha = require('mocha'),
    keypress = require('../testKeypress');

mocha.describe('Is a in Boston Red Sox?', function() {
    let result = keypress('a', 'Boston Red Sox', 12,
        0, [], 0, []);
    mocha.it('Should return that letter was not found', function() {
        assert.equal("incorrect", result.status);
    });
    mocha.it('The incorrect letters array should contain the letter', function() {
        assert.equal('a', result.incorrectLetters[0]);
    });
    mocha.it('There should now be one incorrect guess', function() {
        assert.equal(1, result.incorrectGuesses);
    });
});

mocha.describe('Is s in Boston Red Sox?', function() {
    let result = keypress('s', 'Boston Red Sox', 12,
        0, [], 0, []);
    mocha.it('Should return that letter was found', function() {
        assert.equal("correct", result.status);
    });
    mocha.it('The found letters array should contain the letter', function() {
        assert.equal('s', result.foundLetters[0]);
    });
    mocha.it('numFoundLetters should now be 2', function() {
        assert.equal(2, result.numFoundLetters);
    });
});

mocha.describe('Does it allow repeat guesses of s and a in Boston Red Sox?', function() {
    let result = keypress('s', 'Boston Red Sox', 12,
        2, ['s'], 0, []);
    mocha.it('Should return that letter was already found', function() {
        assert.equal("already found", result.status);
    });

    let result2 = keypress('a', 'Boston Red Sox', 12,
        0, [], 1, ['a']);
    mocha.it('Should return that letter was already guessed incorrectly', function() {
        assert.equal("already guessed", result2.status);
    });
});

mocha.describe('Does it properly enter win/loss states?', function() {
    let result = keypress('n', 'Boston Red Sox', 12,
        11, ['s', 'b', 'o', 't', 'r', 'e', 'd', 'x'], 2, ['p', 'l']);
    mocha.it('Should return that the entire word has been found', function() {
        assert.equal("win", result.status);
    });

    let result2 = keypress('a', 'Boston Red Sox', 12,
        2, ['d', 'n'], 9, ['e', 'p', 'l', 'z', 'q', 'w', 'c', 'h', 'u']);
    mocha.it('Should return that the game has been lost', function() {
        assert.equal("loss", result2.status);
    });
});
