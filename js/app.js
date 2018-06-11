/*
 * Create a list that holds all cards in the deck
 */

var cardDeck = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor",
           "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
           "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];

// Game variables
var score = 3;
var moves = 0;
var open = [];
var match_found = 0;
var timer = {
    seconds: 0,
    minutes: 0,
    clearTime: -1
};

var game_started = false;

// Rating system
var perfect = 20;
var good = 25;
var modal = $("#victory-modal");

var timerStart = function() {
  if (timer.seconds === 59) {
    timer.minutes++;
    timer.seconds >= 0;
  } else {
    timer.seconds++;
  }

  var formattedSec = "0";
  if (timer.seconds < 10) {
    formattedSec += timer.seconds;
  } else {
    formattedSec = String(timer.seconds);
  }

  var time = String(timer.minutes) + ":" + formattedSec;
  $(".timer").text(time);
};

//Timer reset function
function resetTimer() {
    clearInterval(timer.clearTime);
    timer.minutes = 0;
    timer.seconds = 0;
    $(".timer").text("0:00");

    timer.clearTime = setInterval(timerStart, 1000);
};


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Score reset
function starReset() {
    $(".fa-star-o").attr("class", "fa fa-star");
    score = 3;
    $(".num-stars").text(String(score));
};

// Resets all open cards
var resetOpen = function() {
    open.forEach(function(card){
        card.toggleClass("open");
        card.toggleClass("show");
    });
    open = [];
};

// Full game reset
var gameReset = function() {
    clearInterval(timer.clearTime);
    $(".timer").text("0:00");
    open = [];
    match_found = 0;
    moves = 0;
    game_started=false;
    updateMoves();
    $(".card").attr("class", "card");
    updateCards();
    starReset();
};

// Randomizes cards on board and updates card HTML
function updateCards() {
    cardDeck = shuffle(cardDeck);
    var index = 0;
    $.each($(".card i"), function(){
      $(this).attr("class", "fa " + cardDeck[index]);
      index++;
    });
};


// Toggles victory modal box
function victoryModal() {
    modal.css("display", "block");
};

// Removes last star from scoreboard
function starRemove() {
    $(".fa-star").last().attr("class", "fa fa-star-o");
    score--;
    $(".num-stars").text(String(score));
};

// Updates number of moves in the HTML, removes star if necessary based on difficulty variables
function updateMoves() {
    $(".moves").text(moves);

    if (moves === perfect || moves === good) {
        starRemove();
    }
};

// Checks if card is a valid move (if it not currently matched or open)
function isValid(card) {
    return !(card.hasClass("open") || card.hasClass("match"));
};

// Checks and returns if cards matches or not
function checkMatch() {
    if (open[0].children().attr("class")===open[1].children().attr("class")) {
        return true;
    } else {
        return false;
    }
};


// Victory condition
function victory() {
	if (match_found === 16) {
		return true;
	} else {
		return false;
	}
};

// Marks open cards as matched and checks victory condition

var setMatch = function() {
	open.forEach(function(card){
		card.addClass("match");
	});
	open = [];
	match_found += 2;

	if (victory()) {
		clearInterval(timer.clearTime);
		victoryModal();
	}
};

// Sets selected card to the open and shown state
function openCard(card) {
    if (!card.hasClass("open")) {
        card.addClass("open");
        card.addClass("show");
        open.push(card);
    }
};

// Game mechanics
var onClick = function() {
/*/    if(timer.seconds == 0 && timer.minutes == 0){
    resetTimer();
    }
/*/
    if (game_started == false) {
        game_started = true;
        resetTimer();
    }
    if (isValid( $(this) )) {

        if (open.length === 0) {
            openCard( $(this) );

        } else if (open.length === 1) {
            openCard( $(this) );
            moves++;
            updateMoves();

            if (checkMatch()) {
                setTimeout(setMatch, 350);

            } else {
                setTimeout(resetOpen, 650);

            }
        }
    }
};

// Play again function. It resets the game and removes victory modal box
var playAgain = function() {
    gameReset();
    modal.css("display", "none");
};

// Event triggers
$(".card").click(onClick);
$(".restart").click(gameReset);
$(".play-again").click(playAgain);

// Game board randomizer
$(updateCards);


