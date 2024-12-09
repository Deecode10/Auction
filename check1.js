
let timerInterval;
let currentTimer = 60; 
let playerIndex = -1;


const players = [
  {
    name: "Water Bottle",
    country: "India",
    category: "batsman",
    basePrice: 100,
    image:"https://tse4.mm.bing.net/th?id=OIP.bzl5dDWLce9T3BR2muwxUwHaHa&pid=Api&P=0&h=220"
  },
  {
    name: "Leather Bag",
    country: "Australia",
    category: "Bowler",
    basePrice: 150,
    image:"http://image26.stylesimo.com/o_img/2018/05/09/254400-10543190/women-s-vintage-leather-handbag-cross-body-shoulder-bag-with-rivet.jpg"
  },
  {
    name: "College Bag",
    country: "England",
    category: "All-Rounder",
    basePrice: 200,
    image:"https://i5.walmartimages.com/asr/76526810-91da-4917-87c1-69245968fdc7_2.f1f4cd6ed762d85ca8fcb08508c10147.jpeg"
  }
];


function renderPlayers() {
  const playersList = document.getElementById("playersList");
  playersList.innerHTML = "";

  players.forEach((player, index) => {
    const li = document.createElement("li");
    li.className = "player-item";
    li.id = `player${index}`;

    const playerDetails = document.createElement("div");
    playerDetails.className = "player-details";
    playerDetails.innerHTML = `<span><h1>${player.name}</h1></span><img src="${player.image}" height=100/><P>Base-Price: $${player.basePrice} `

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
const teams = {
  team1: { name: "Roshni", budget: 400, players: [], bids: [] },
  team2: { name: "Aditi", budget: 150, players: [], bids: [] },
  team3: { name: "Rahul", budget: 100, players: [], bids: [] }
};


function renderTeamWidgets() {
  for (const teamId in teams) {
    const teamWidget = document.getElementById(teamId);
    teamWidget.querySelector("h2").textContent = teams[teamId].name;
    updateTeamBudget(teamId, teams[teamId].budget);

    const bidButton = teamWidget.querySelector(".bid-now-button");
    bidButton.addEventListener("click", () => teamBid(teamId));
  }
}

function updateTeamBudget(teamId, budget) {
  document.getElementById(`budget-${teamId}`).textContent = `$${budget}`;
}

renderTeamWidgets(); 
function startBid(i) {
  playerIndex = i; 
  clearInterval(timerInterval);
  currentTimer = 60; 
  timerInterval = setInterval(updateTimer, 1000); 

  
  showTimerContainer();
  enableAllBidButtons();
}


function updateTimer() {
  const timerElement = document.getElementById("timer");
  timerElement.textContent = currentTimer;
  if (currentTimer === 0) {
    clearInterval(timerInterval);
    disableAllBidButtons();
    hideTimerContainer();
    sellPlayer();
  }
  currentTimer--;
}


function showTimerContainer() {
  const timerContainer = document.querySelector(".timer-container");
  timerContainer.style.display = "block";

  const soldContainer = document.querySelector(".sold-container");
  soldContainer.style.display = "block";
}


function hideTimerContainer() {
  const timerContainer = document.querySelector(".timer-container");
  timerContainer.style.display = "none";

  const soldContainer = document.querySelector(".sold-container");
  soldContainer.style.display = "none";
}


function enableAllBidButtons() {
  const bidButtons = document.querySelectorAll(".bid-now-button");
  bidButtons.forEach(button => {
    button.disabled = false;
  });
}


function disableAllBidButtons() {
  const bidButtons = document.querySelectorAll(".bid-now-button");
  bidButtons.forEach(button => {
    button.disabled = true;
  });
}


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

  if (bidAmount > teams[teamId].budget) {
    alert("Team does not have enough budget to place this bid.");
    return;
  }

  const biddingInfo = {
    teamId: teamId,
    playerIndex: playerIndex,
    bidAmount: bidAmount
  };

  if (!teams[teamId].bids) {
    teams[teamId].bids = [];
  }
  teams[teamId].bids[playerIndex] = biddingInfo;
}


function sellPlayer() {
  const highestBidder = getHighestBidder();
  if (highestBidder !== null) {
    const teamId = highestBidder.teamId;
    const bidAmount = highestBidder.bidAmount;
    const player = players[playerIndex];

    
    teams[teamId].budget -= bidAmount;

    const playerListItem = document.getElementById(`player${playerIndex}`);
    playerListItem.classList.add("sold");
    playerListItem.querySelector(".start-bid-button").style.display = "none";
    const soldTo = document.createElement("span");
    soldTo.textContent = `SOLD to: ${teams[teamId].name} for $${bidAmount}`;
    playerListItem.appendChild(soldTo);

    const purchasedList = document.getElementById(`players-${teamId}`);
    const purchasedItem = document.createElement("li");
    purchasedItem.textContent = `${player.name} - $${bidAmount}`;
    purchasedList.appendChild(purchasedItem);

    updateTeamBudget(teamId, teams[teamId].budget);

    hideTimerContainer();
    disableAllBidButtons();
    playerIndex = -1;
  }
}

function getHighestBidder() {
  let highestBidder = null;
  for (const teamId in teams) {
    if (teams[teamId].bids && teams[teamId].bids[playerIndex]) {
      const bidAmount = teams[teamId].bids[playerIndex].bidAmount;
      if (!highestBidder || bidAmount > highestBidder.bidAmount) {
        highestBidder = teams[teamId].bids[playerIndex];
      }
    }
  }
  return highestBidder;
}
