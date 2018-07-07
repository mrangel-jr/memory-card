/*
 * Create a list that holds all of your cards
 */
const cards = ["fa-diamond","fa-diamond","fa-paper-plane-o","fa-paper-plane-o",
            "fa-anchor","fa-anchor","fa-bolt","fa-bolt","fa-cube","fa-cube",
            "fa-bicycle","fa-bicycle","fa-leaf","fa-leaf","fa-bomb","fa-bomb"];
let openCards = [];
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

function setShow(card) {
    card.classList.toggle("show");
}

function setOpenOrClose(card) {
    card.classList.toggle("open");
}

function setError(card) {
    card.classList.toggle("error");
}

function setMatch(card) {
    setOpenOrClose(card);
    setShow(card);
    card.classList.toggle("match");
}
function clickedCard(elem) {
    elem.addEventListener('clicked', function (e) {
        e.preventDefault();
        console.log(e.target);
        console.log(elem);
        console.log(this);
        if (openCard === null) {
            openCard = elem;
            setOpenOrClose(elem);
        }

        if(openCard !== null) {
            let typeLastCard = openCard.firstChild.classList.toString();
            let typeNewCard = elem.firstChild.classList.toString();
            if (typeLastCard === typeNewCard) {
                setMatch(openCard);
                setMatch(elem);
            } else {
                setOpenOrClose(openCard);
                setOpenOrClose(elem);
            }
            openCard = null;
        }
    });
    return elem;
}

function checkedCard(elem) {
    console.log(elem);
}

function startMemoryGame() {
    let cards = document.querySelectorAll(".card");
    cards.forEach(card => card.remove());
    let deck = document.querySelector(".deck");
    shuffledCards.map(item => {
        let icon = document.createElement("i");
        icon.classList.add("fa");
        icon.classList.add(item);
        let card = document.createElement("li");
        card.classList.add("card");
        card.appendChild(icon);
        card.addEventListener('click', function (e) {
            e.preventDefault();
            let elem = e.target;
            console.log(openCards)
            if(openCards.length<2 && elem.classList.contains("match")===false) {
                setOpenOrClose(elem);
                setShow(elem);
                openCards.push(elem);
            }
            if(openCards.length === 2) {
                let typeLastCard = openCards[0].firstChild.classList.toString();
                let typeNewCard = openCards[1].firstChild.classList.toString();
                if (typeLastCard === typeNewCard) {
                    openCards.map(card => setMatch(card));
                    openCards = [];
                    openCards.length = 0;
                } else {
                    setTimeout(()=> {
                        openCards.map(card => setOpenOrClose(card));
                        openCards.map(card => setError(card));
                        console.log(openCards);                        
                        openCards.map(card => setError(card));
                        openCards.map(card => setShow(card));
                        openCards = [];
                        openCards.length = 0;
                    },1000);
                }
            }
            if (openCards.length>2) {
                console.log(openCards);
            } 
        });
        // clickedCard(card);
        deck.appendChild(card);
    })
}
    

startMemoryGame();

