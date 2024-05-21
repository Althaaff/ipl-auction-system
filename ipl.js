/*
  Step 1: Global Variables
*/
let timerInterval;
let currentTimer = 10; // 1min
let playerIndex = -1;




/*
  Step 2: Basic players rendering
*/

// Players Object with player Info: 
const players = [
 {
   name: "Virat Kohli",
   country: "India",
   category: "Batsman",
   basePrice: 300
},
{
  name: "Brett lee",
  country: "Australia",
  category: "Bowler",
  basePrice: 150,
},
{
  name: "Moeen Ali",
  country: "England",
  category: "Allrounder",
  basePrice: 200,
}
];

// function to render players : 
function renderPlayers() {
    const playersList = document.getElementById("playersList");
    playersList.innerHTML = "";


players.forEach((player, index) => {
    const li = document.createElement("li");
    li.className = "player-item";
    li.id = `player${index}`;

    const playerDetails = document.createElement("div");
    playerDetails.className = "player-details";
    playerDetails.textContent = `${index + 1}. ${player.name} - ${player.country} - ${player.category} - Base Price: $${player.basePrice}`;
    // console.log(playerDetails.textContent);

    const startBidButton = document.createElement("button");
    startBidButton.className = "start-bid-button";
    startBidButton.textContent = "Start Bid";
    startBidButton.addEventListener("click", () => startBid(index));

    li.appendChild(playerDetails);
    li.appendChild(startBidButton);
    playersList.appendChild(li);
  });
}
renderPlayers();

/*
  Step 3: Basic team rendering 
 */
/*
 Teams Object with team Info :  
 */
const teams = {
    team1: { name: "Rajathan Royals", budget: 400, players: [], bids: []},
    team2: { name: "Chennai Super Kings", budget: 150, players: [], bids: []},
    team3: { name: "RCB", budget: 500, players: [], bids: []}
};

//Function to render team Objects
function renderTeamWidgets() {
    for(const teamId in teams) {
        const teamWidget = document.getElementById(teamId);
        teamWidget.querySelector("h2").textContent = teams[teamId].name;

        updateTeamBudget(teamId, teams[teamId].budget);
        const bidButton = teamWidget.querySelector(".bid-now-button");
        bidButton.addEventListener("click", () => teamBid(teamId));
    }
}

function updateTeamBudget(teamId, budget) {
    document.getElementById(`budget-${teamId}`).textContent = `$${budget}`
}
renderTeamWidgets(); //funciton called //

/*
  Step 4: Start Bid Function (All teams allowed to Bid)
 */
// Recieving i as index of player :
  function startBid(i) {
    console.log(i);
    playerIndex = i; // set the player index
    clearInterval(timerInterval); // clear previous time if any
    currentTimer = 10; // Reset the timer to 60 seconds 
    timerInterval = setInterval(updateTimer, 1000); // Start the Timer 

    // call this function to show timer and enable bidding buttons :
    showTimerContainer();
    enableAllBidButtons();
  }

// function to call update Timer : 
function updateTimer() {
    const timerElement = document.getElementById("timer");
    timerElement.textContent = currentTimer;
    if (currentTimer == 0) {
      clearInterval(timerInterval);
      disableAllBidButtons();
      hideTimerContainer();
      sellPlayer();
    }
    currentTimer--;
}

// Function to show the timer & sold button: 
function showTimerContainer() {
  const timerContainer = document.querySelector(".timer-container");
  timerContainer.style.display = "block";

  const soldContainer = document.querySelector(".sold-container");
  soldContainer.style.display = "block";
}

// function to hide the timer and sold button : 
function hideTimerContainer() {
  const timerContainer = document.querySelector(".timer-container");
  timerContainer.style.display = "none";

  const soldContainer = document.querySelector(".sold-container");
  soldContainer.style.display = "none";
}

// function to enable all Bid Now Buttons  :
function enableAllBidButtons() {
  const bidButtons = document.querySelectorAll(".bid-now-button");
  bidButtons.forEach(button => {
    button.disabled = false;
  });
}


// function to disable all Bid Now Buttons  :
   function disableAllBidButtons() {
    const bidButtons = document.querySelectorAll(".bid-now-button");
    bidButtons.forEach(button => {
      button.disabled = true;
    });
   }
/*
  Step 5: Bidding by the teams 
*/
function teamBid(teamId) {
  const bidAmount = parseFloat(
    prompt(
      `Enter bidding amount for ${players[playerIndex].name}:`,
      players[playerIndex].basePrice
    )
  );

  if (isNaN(bidAmount) || bidAmount < players[playerIndex].basePrice) {
    alert("Invalid bid amount.");
    return;
  }

  // Check if the team has enough balance to place the bid :
  if (bidAmount > teams[teamId].budget) {
    alert("Teams does not have enough budget to place this bid.");
    return;
  };

// Store the bidding information within the teams object :
const biddingInfo = {
  teamId: teamId,
  playerIndex: playerIndex,
  bidAmount: bidAmount,
};

// If the team has already bid on this player, update the bidding information
if (!teams[teamId].bids) {
  teams[teamId].bids = [];
}
teams[teamId].bids[playerIndex] = biddingInfo;
console.log(teams);
}


/*
  Step 6: Sell the players to team
 */

function sellPlayer() {
  const highestBidder = getHighestBidder();
  
  if(highestBidder !== null) {
    const teamId = highestBidder.teamId;
    const bidAmount = highestBidder.bidAmount;
    const player = players[playerIndex];

    // Deduct the bid amount from the teams budget :
    teams[teamId].budget -= bidAmount;

    // Update the UI to show the players is sold to the team :
    const playerListItem = document.getElementById(`player${playerIndex}`);
    playerListItem.classList.add("sold");
    playerListItem.querySelector(".start-bid-button").style.display = "none";
    const soldTo = document.createElement("span");
    soldTo.textContent = `Sold to: ${teams[teamId].name} for $${bidAmount}`;
    playerListItem.appendChild(soldTo);
    
    // Add the player to the purchase list of the team 
    const purchaseList = document.getElementById(`players-${teamId}`);
    const purchasedItem = document.createElement("li");
    purchasedItem.textContent = `${player.name} - $${bidAmount}`;
    purchaseList.appendChild(purchasedItem);

    // Update the teams budget on the UI :
    updateTeamBudget(teamId, teams[teamId].budget);

    // Reset Items: 
    hideTimerContainer();
    disableAllBidButtons();
    playerIndex = -1;
  }
}

// function to get highest bidder for the player : 
function getHighestBidder() {
   let highestBidder = null;
   for (const teamId in teams) {
    if (teams[teamId].bids && teams[teamId].bids[playerIndex]) {
      const bidAmount = teams[teamId].bids[playerIndex].bidAmount;
      if(!highestBidder || bidAmount > highestBidder.bidAmount) {
        highestBidder = teams[teamId].bids[playerIndex];
     }
    }
   }
return highestBidder;
}

