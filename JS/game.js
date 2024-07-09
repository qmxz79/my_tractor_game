// game.js
import { shuffleDeck, dealCards, getDealer, getTrump, getValidCards, getWinningPlayer, calculateScore, isGameOver, getWinner, buildDeck } from './utils.js';

function startGame() {
  // 获取玩家输入的名称
  let player1Name = document.getElementById('player1-name').value;
  let player2Name = document.getElementById('player2-name').value;
  let player3Name = document.getElementById('player3-name').value;
  let player4Name = document.getElementById('player4-name').value;

  // 根据玩家输入的名称和游戏模式设置玩家列表
  if (gameMode === 'human-vs-human') {
    players = [player1Name, player2Name, player3Name, player4Name];
  } else if (gameMode === 'human-vs-ai') {
    players = [player1Name, 'AI Player 1', 'AI Player 2', 'AI Player 3'];
  }

  // 初始化游戏状态
  let deck = buildDeck();
  shuffleDeck(deck);
  await dealCards(deck, players);
  // ...
}
  let dealer = getDealer();
  let trump = getTrump(dealer);
  let scores = [0, 0, 0, 0];

  // 更新游戏界面
  updatePlayerHands(players);
  updateTrickCards([], trump);
  updateScores(scores);

  // 开始出牌
  let currentPlayer = dealer;
  let currentTrick = [];
  while (true) {
    let playedCard = playCard(currentPlayer, currentTrick, trump);
    currentTrick.push(playedCard);
    currentPlayer = getNextPlayer(currentPlayer, players);

    // 检查是否一轮出牌完成
    if (currentTrick.length === 4) {
      // 判断本轮胜者并计分
      let winningPlayer = getWinningPlayer(currentTrick, trump);
      scores[players.indexOf(winningPlayer)] += calculateScore(currentTrick);
      updateScores(scores);

      // 更新当前玩家为本轮胜者
      currentPlayer = winningPlayer;
      currentTrick = [];
    }

    // 检查是否游戏结束
    if (isGameOver(deck, players)) {
      // 判断最终胜利者并显示结果
      let winner = getWinner(scores);
      alert(`${winner} wins the game!`);
      break;
    }
  }
}

function playCard(player, trick, trump) {
  // 如果是人机对战,且当前玩家是AI,则由AI自动出牌
  if (gameMode === 'human-vs-ai' && players.indexOf(player) > 0) {
    return playAICard(player, trick, trump);
  } else {
    // 人类玩家出牌的逻辑
    let validCards = getValidCards(player, trick, trump);
    let playedCard = prompt(`${player}, please play a card: ${validCards.join(', ')}`);
    while (!validCards.includes(playedCard)) {
      playedCard = prompt('Invalid card. Please play a valid card.');
    }
    return playedCard;
  }
}

function playAICard(aiPlayer, trick, trump) {
  // 实现AI出牌的逻辑
  let validCards = getValidCards(aiPlayer, trick, trump);
  return validCards[Math.floor(Math.random() * validCards.length)];
}

function updatePlayerHands(players) {
  for (let player of players) {
    let playerHandElement = document.getElementById(`${player}-hand`);
    playerHandElement.innerHTML = '';
  }
}

function updateTrickCards(trick, trump) {
  let trickCardsElement = document.getElementById('trick-cards');
  trickCardsElement.innerHTML = '';
  for (let card of trick) {
    let cardElement = createCardElement(card, trump);
    trickCardsElement.appendChild(cardElement);
  }
}

function updateScores(scores) {
  for (let i = 0; i < players.length; i++) {
    let scoreElement = document.getElementById(`${players[i]}-score`);
    scoreElement.textContent = scores[i];
  }
}

function createCardElement(card, trump) {
  let cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.textContent = `${getCardSymbol(card)}${getCardRank(card)}`;
  if (getSuit(card) === trump) {
    cardElement.style.color = 'red';
  }
  return cardElement;
}

let gameModeRadios = document.querySelectorAll('input[name="gameMode"]');
gameModeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    gameMode = radio.value;
  });
});
