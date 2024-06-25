/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // Assuming `games` is an array of game objects
    for (let game of games) {
        // create a new div element, which will become the game card
        let gameCard = document.createElement('div');

        // add the class game-card to the list
        gameCard.classList.add('game-card');

        // set the inner HTML using a template literal to display some info about each game
        gameCard.innerHTML = `
        <img src="${game.img}" class="game-img" />
        <h2>${game.name}</h2>
        <p>${game.description}</p>
        `;

        // append the game to the games-container
        document.getElementById('games-container').appendChild(gameCard);
    }

}
// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
let totalContributions = GAMES_JSON.reduce((total, game) => total + game.backers, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalContributions.toLocaleString()}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

// use reduce() to calculate the total amount raised
let totalRaised = GAMES_JSON.reduce((total, game) => total + game.pledged, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

// set the inner HTML to the number of games
gamesCard.innerHTML = `${GAMES_JSON.length}`;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/




/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");
// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
    this.classList.add('active');
    fundedBtn.classList.remove('active');
    allBtn.classList.remove('active');

    // change the game status text
    document.getElementById("game-status").innerHTML = "(Unfunded)";
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);

    // use the function we previously created to add the funded games to the DOM
    addGamesToPage(fundedGames);
    this.classList.add('active');
    unfundedBtn.classList.remove('active');
    allBtn.classList.remove('active');

    // change the game status text
    document.getElementById("game-status").innerHTML = "(Funded)";
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);

    this.classList.add('active');
    fundedBtn.classList.remove('active');
    unfundedBtn.classList.remove('active');

    // change the game status text
    document.getElementById("game-status").innerHTML = "(All)";
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener('click', filterUnfundedOnly);
fundedBtn.addEventListener('click', filterFundedOnly);
allBtn.addEventListener('click', showAllGames);

// calculate the number of unfunded games
let unfundedGamesCount = GAMES_JSON.filter(game => game.pledged < game.goal).length;

// calculate the total amount of money raised
let totalPledged = GAMES_JSON.reduce((total, game) => total + game.pledged, 0);

// calculate the total number of games
let totalGames = GAMES_JSON.length;

// create a string that explains the number of unfunded games using the ternary operator
let unfundedGamesText = `A total of $${totalPledged.toLocaleString()} has been raised for ${totalGames} games. Currently, ${unfundedGamesCount} game${unfundedGamesCount !== 1 ? 's' : ''} remain unfunded. We need your help to fund these amazing games! Following is our stats until today:`;

// create a new DOM element containing the template string
let unfundedGamesElement = document.createElement('p');
unfundedGamesElement.textContent = unfundedGamesText;

// append the new element to the description container
descriptionContainer.appendChild(unfundedGamesElement);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
let [firstGame, secondGame] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
let firstGameElement = document.createElement('p');
firstGameElement.textContent = firstGame.name;
firstGameContainer.appendChild(firstGameElement);

// do the same for the runner up item
let secondGameElement = document.createElement('p');
secondGameElement.textContent = secondGame.name;
secondGameContainer.appendChild(secondGameElement);



// adding search functionality
const searchBar = document.getElementById('search-bar');

searchBar.addEventListener('input', (event) => {

    deleteChildElements(gamesContainer);
    const searchQuery = event.target.value.toLowerCase();
    const filteredGames = GAMES_JSON.filter(game => game.name.toLowerCase().includes(searchQuery));
    if (filteredGames.length === 0) {
        gamesContainer.innerHTML = '<p class="no-games">No games with that name found</p>';
    }
    // Use addGamesToPage function with filteredGames
    addGamesToPage(filteredGames);
});

// animating all elements

function animateFadeIn(element) {
    element.animate([
        // keyframes
        { opacity: '0' },
        { opacity: '1' }
    ], {
        // timing options
        duration: 1000,
        iterations: 1,
        easing: 'ease-out',
        fill: 'forwards'
    });
}

// Get all elements in the body
const allElements = document.body.getElementsByTagName('*');

// Animate each element
let delay = 0;
for (let element of allElements) {
    setTimeout(() => animateFadeIn(element), delay);
    delay += 5; 
}

// Show all games by default
showAllGames();
