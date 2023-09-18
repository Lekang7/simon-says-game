// Define some initial variables to use in the code
var Sequence = [];
var usedSequence = [];
var level = 0;
var gameCheck = false;
var highScore = 0;
var signalInterval = 600;
var speedupAtLevels = [5, 9, 13];

// Function to add a random number to the sequence array
function addSequence() {
    var pValue = randNum(1, 4);
    Sequence.push(pValue);

    // It should speed up the game every few levels by decreasing the signal interval
    if (speedupAtLevels.includes(Sequence.length)) {
        signalInterval *= 0.8;
    }
}

// Function is to play the sequence by flashing the circles
function playSequence() {
    for (var i = 0; i < Sequence.length; i++) {
        var delayTime = i * signalInterval;
        setTimeout(flashCircle, delayTime);
    }
}

// Function is to flash a circle
function flashCircle() {
    var item = Sequence.pop();
    gameCheck = true;
    $('#' + item).animate({
        opacity: 0.2
    }, 200).animate({
        opacity: 1
    }, 100);
    usedSequence.push(item);

    // If the sequence is done flashing, create the click events
    if (Sequence.length <= 0) {
        createClicks();
    }
}

// Function is to create the click events
function createClicks() {
    $('.shapes').click(function() {
        var item = usedSequence.shift();
        var circleId = $(this).attr('id');
        $(this).animate({
            opacity: 0.2
        }, 200).animate({
            opacity: 1
        }, 100);

        // If the user clicked the right circle, add it to the sequence
        if (item == circleId) {
            Sequence.push(item);

            // If the user has completed the sequence, increase the level and start a new round
            if (usedSequence.length <= 0) {
                level++;
                $('#currentscore').html(level);

                // If the current level is higher than the high score, update the highscore
                if (level > highScore) {
                    highScore = level;
                    $('#highscore').html(highScore);
                }
                removeClicks();
                addSequence();
                setTimeout(playSequence, 800);
                clearTimeout(timer);
            }
        }

        // If the user clicked the wrong circle, it should end the game
        else {
            gameCheck = false;
            Sequence = [];
            usedSequence = [];
            clearTimeout(timer);
            endGame();
        }
    });
}

// Function is to remove the click events
function removeClicks() {
    $('.shapes').unbind();
}

// Function is to start the game
function startGame() {
    removeClicks();
    resetGame();
    $('#light').css('background-color', 'green');
    addSequence();
    playSequence();

    
}

// Function is to end the game
function endGame() {
    $('#light').css('background-color', 'red');
    for (var i = 0; i < 5; i++) {
        $('.shapes')
            .animate({
                opacity: 0.2
            }, 200)
            .animate({
                opacity: 1
            }, 200);
    }
    resetGame();
}

//Function is to reset the game
function resetGame() {
    level = 0;
    $('#currentscore').html(level);
    Sequence = [];
    usedSequence = []; 
    gameCheck = false; 
    signalInterval = 600; 
    $('#light').css('background-color', 'red');
}

//When start button is clicked it should start the game
$('#startButton').click(function() {
    if (gameCheck === false) {
        setTimeout(startGame,1500);
    }
});

function randNum(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

// allows game to be reset
$('#resetButton').click(function() {
    resetGame();
});
