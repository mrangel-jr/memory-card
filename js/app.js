/*
 * Create a list that holds all of your cards
 */

let mainCards = ["fa-diamond","fa-paper-plane-o","fa-anchor","fa-bolt","fa-cube",
            "fa-bicycle","fa-leaf","fa-bomb"];
mainCards = mainCards.concat(mainCards);
let openCards = [];
let countMoves = 0;
let matchedCards = [];
let countStars = 3;
let firstClick = true;
const timer = new Timer();
const restartGame = function() {
    startGame();
};

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 /*
  *  Result after finish game
  */
function finishedGame() {
    timer.pause();
    let pText = document.querySelector("#resultFinished");
    let iStars =  parseInt(countStars);
    let middle = countStars > iStars ? 'and a half' : '';
    pText.innerHTML = `You won with ${countMoves} moves and ${iStars} ${middle} stars in ${timer.getTimeValues().toString()}.`;
    $('#myModal').modal();
}

/*
 *  Calculate how many stars the player have
 */
function recalcStars() {
    const stars = document.querySelector(".stars");
    if ((countStars===3 && countMoves === 11) || (countStars===2 && countMoves === 17) )    {
        stars.children[countStars-1].firstElementChild.classList.replace('fa-star','fa-star-half-o');
        countStars -= 0.5;
    }
    if ((parseInt(countStars)===2 && countMoves === 14) || (parseInt(countStars)===1 && countMoves === 20))    {
        countStars -= 0.5;
        stars.children[countStars].firstElementChild.classList.replace('fa-star-half-o','fa-star-o');
    }
}

/*
 * Reset Methods  
 */
function resetGame() {
    resetStars();
    resetCounter();
    resetMatchedCards();
    resetTimer();
}

function resetStars() {
    countStars=3;
    const stars = document.querySelector(".stars");
    for (star of stars.children) {
        star.firstElementChild.classList.remove('fa-star-half-o','fa-star-o');
        star.firstElementChild.classList.add('fa-star');
    }
}

function resetMatchedCards() {
    matchedCards = [];
    matchedCards.length = 0;
    openCards = [];
    openCards.length = 0;
}

function resetTimer() {
    let timerView = document.querySelector("#timer .values");
    timerView.innerHTML = '00:00:00';
    timer.stop();
    firstClick = true;
}

function resetCounter() {
    let counter = document.querySelector(".moves");
    countMoves = 0;
    counter.innerHTML = countMoves;
}

function resetCard(card) {
    let types = card.classList.toString();
    types.split(" ").map((item,index) => {
        if (index>0) {
            card.classList.remove(item);
        }
    });
}

/*
 * Moves Counter
 */

function addCounter() {
    let counter = document.querySelector(".moves");
    countMoves += 1;
    counter.innerHTML = countMoves;
}
/*
 * Start Timer
 */

function startTimer() {
    timer.start();
    timer.addEventListener('secondsUpdated', function (e) {
        $('#timer .values').html(timer.getTimeValues().toString());
    });
    timer.addEventListener('started', function (e) {
        $('#timer .values').html(timer.getTimeValues().toString());
    });
}
/*
 * Show/Hide Cards  
 */

function setOpenOrClose(card) {
    if (card.classList.contains("open")) {
        $(card).removeClass("open","flip","animated");
    } else {
        $(card).addClass("open flip animated").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(card).removeClass("flip animated");
        });
    }
}
/*
 * Error Cards  
 */

function setError(card) {
    $(card).addClass("error shake animated").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $(card).removeClass("error shake animated");
    });
}
/*
 * Match Cards  
 */

function setMatch(card) {
    $(card).addClass("match rubberBand animated").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $(card).removeClass("rubberBand animated");
    });
}
/*
 * onClickCard Methods  
 */

function clickedCard(item) {
    item.addEventListener('click', function (e) {
        e.preventDefault();
        let elem = e.target;
        if(openCards.length<2 && elem.classList.contains("match")===false) {
            if (!(openCards.length>0 && openCards[0].id===elem.id)) {
                if(firstClick) {
                    startTimer();
                    firstClick = false;
                }
                setOpenOrClose(elem);
                openCards.push(elem);
            }
        }
        if(openCards.length === 2) {
            addCounter();
            recalcStars();
            setTimeout(()=> {
                let typeLastCard = openCards[0].firstChild.classList.toString();
                let typeNewCard = openCards[1].firstChild.classList.toString();
                if (typeLastCard === typeNewCard) {
                    openCards.map(card => {
                        resetCard(card);
                        setMatch(card);
                        matchedCards.push(card);
                    });
                    if (matchedCards.length === mainCards.length) {
                        finishedGame();
                    }
                    openCards = [];
                    openCards.length = 0;
                } else {
                    openCards.map(card => {
                        resetCard(card);
                        setError(card);
                    });
                    setTimeout(() => {
                        openCards.map(card => {
                            resetCard(card);
                        });
                        openCards = [];
                        openCards.length = 0;
                    },1000);
                }
            },700);
        }
    });
}
/*
 * Start Game  
 */

function startGame() {
    resetGame();
    let shuffledCards = shuffle(mainCards);
    let cards = document.querySelectorAll(".card");
    cards.forEach(card => card.remove());
    let deck = document.querySelector(".deck");
    let fragment = document.createDocumentFragment();
    shuffledCards.map((item,index) => {
        let icon = document.createElement("i");
        icon.classList.add("fa",item);
        let card = document.createElement("li");
        card.classList.add("card");
        card.setAttribute("id","card-"+index);
        card.appendChild(icon);
        clickedCard(card);
        fragment.appendChild(card);
    });
    deck.appendChild(fragment);
}
/*
 * Create Game  
 */
function startMemoryGame() {
    const btnPlayAgain = document.querySelector("#btnPlayAgain");
    btnPlayAgain.addEventListener('click', restartGame);
    const restart = document.querySelector(".restart");
    restart.addEventListener('click',restartGame);
    startGame();
}
    

startMemoryGame();

