/*
 * Create a list that holds all of your cards
 */
const cards = ["fa-diamond","fa-diamond","fa-paper-plane-o","fa-paper-plane-o",
            "fa-anchor","fa-anchor","fa-bolt","fa-bolt","fa-cube","fa-cube",
            "fa-bicycle","fa-bicycle","fa-leaf","fa-leaf","fa-bomb","fa-bomb"];
let openCards = [];
let countMoves = 0;
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

let shuffledCards = shuffle(cards);
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
function resetCounter() {
    let counter = document.querySelector(".moves");
    counter.innerHTML = 0;
}

function addCounter() {
    let counter = document.querySelector(".moves");
    counter.innerHTML = parseInt(counter.innerHTML) + 1;
}

function resetCard(card) {
    let types = card.classList.toString();
    types.split(" ").map((item,index) => {
        if (index>0) {
            card.classList.remove(item);
        }
    })
 }

function setShow(card) {
    card.classList.toggle("show");
}

function setOpenOrClose(card) {
    card.classList.toggle("open");
    setShow(card);
}

function setError(card) {
    card.classList.toggle("error");
    setShow(card);
}

function setMatch(card) {
    setOpenOrClose(card);
    card.classList.toggle("match");
}
function clickedCard(item) {
    item.addEventListener('click', function (e) {
        e.preventDefault();
        let elem = e.target;
        console.log(openCards)
        if(openCards.length<2 && elem.classList.contains("match")===false) {
            setOpenOrClose(elem);
            openCards.push(elem);
            addCounter();
        }
        if(openCards.length === 2) {
            setTimeout(()=> {
                let typeLastCard = openCards[0].firstChild.classList.toString();
                let typeNewCard = openCards[1].firstChild.classList.toString();
                if (typeLastCard === typeNewCard) {
                    openCards.map(card => setMatch(card));
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
                    },400);
                }
            },500);
        }
        if (openCards.length>2) {
            console.log(openCards);
        } 
    });
}

function startGame() {
    resetCounter();
    let cards = document.querySelectorAll(".card");
    cards.forEach(card => card.remove());
    let deck = document.querySelector(".deck");
    let fragment = document.createDocumentFragment();
    shuffledCards.map(item => {
        let icon = document.createElement("i");
        icon.classList.add("fa");
        icon.classList.add(item);
        let card = document.createElement("li");
        card.classList.add("card");
        card.appendChild(icon);
        clickedCard(card);
        fragment.appendChild(card);
    });
    deck.appendChild(fragment);
}

function startMemoryGame() {
    const restart = document.querySelector(".restart");
    restart.addEventListener('click',function() {
        startGame();
    });
    startGame();
}
    

startMemoryGame();

