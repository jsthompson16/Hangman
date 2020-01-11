module.exports = function(guessedLetter, word, numLetters, numFoundLetters, foundLetters, incorrectGuesses, incorrectLetters) {
    let foundALetter = false;
    let alreadyGuessedLetter = false;
    let status;

    for (let j = 0; j < foundLetters.length; j++) {
        if (foundLetters[j].toLowerCase() === guessedLetter) {
            alreadyGuessedLetter = true;
            status = "already found";
        }
    }

    for (let k = 0; k < incorrectLetters.length; k++) {
        if (incorrectLetters[k].toLowerCase() === guessedLetter) {
            alreadyGuessedLetter = true;
            status = "already guessed";
        }
    }

    if (!alreadyGuessedLetter) {
        for (let i = 0; i < word.length; i++) {
            if (word[i].toLowerCase() === guessedLetter) {
                numFoundLetters++;
                foundLetters.push(word[i]);
                foundALetter = true;

                if (numLetters === numFoundLetters)
                    status = "win";
                else
                    status = "correct";
            }
        }

        if (!foundALetter) {
            incorrectGuesses++;
            incorrectLetters.push(guessedLetter);

            if (incorrectGuesses === 10)
                status = "loss";
            else
                status = "incorrect";
        }
    }

    return {
        status: status,
        guessedLetter: guessedLetter,
        word: word,
        numFoundLetters: numFoundLetters,
        foundLetters: foundLetters,
        incorrectGuesses: incorrectGuesses,
        incorrectLetters: incorrectLetters
    };
};
