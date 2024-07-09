export function buildDeck() {
  // 创建216张扑克牌
  let deck = [];
  let suits = ['♠', '♥', '♦', '♣'];
  let ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push(`${suit}${rank}`);
    }
  }
  return deck;
}

export function shuffleDeck(deck) {
  // 洗牌算法
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

export async function dealCards(deck, players) {
  // 发牌给4个玩家
  for (let i = 0; i < 54; i++) {
    for (let j = 0; j < players.length; j++) {
      let card = deck.pop();
      await updatePlayerHands(players[j], card);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

export function getDealer() {
  // 确定庄家
  let lastWinningTeam = localStorage.getItem('lastWinningTeam') || 'Player 1/Player 3';
  let [player1, player3] = lastWinningTeam.split('/');
  return Math.random() < 0.5 ? player1 : player3;
}

export function getTrump(dealer) {
  // 确定主牌
  let validSuits = ['♠', '♥', '♦', '♣'];
  let trumpSuit = prompt(`${dealer}, please call the trump suit (${validSuits.join(', ')})`);
  while (!validSuits.includes(trumpSuit)) {
    trumpSuit = prompt('Invalid suit. Please call a valid trump suit.');
  }
  return trumpSuit;
}

export function getValidCards(player, trick, trump) {
  // 获取玩家可出的有效牌
  let playerHand = getPlayerHand(player);
  let validCards = [];

  if (trick.length === 0) {
    // 首轮出牌
    validCards = playerHand;
  } else {
    // 跟牌
    let leadingSuit = getLeadingSuit(trick);
    for (let card of playerHand) {
      if (getSuit(card) === leadingSuit || getSuit(card) === trump || !hasPlayerSuit(playerHand, leadingSuit)) {
        validCards.push(card);
      }
    }
    if (validCards.length === 0) {
      // 玩家无法跟牌
      validCards = playerHand;
    }
  }

  return validCards;
}

export function getLeadingSuit(trick) {
  // 获取本轮领牌花色
  return getSuit(trick[0]);
}

export function hasPlayerSuit(hand, suit) {
  // 检查玩家是否有某个花色的牌
  for (let card of hand) {
    if (getSuit(card) === suit) {
      return true;
    }
  }
  return false;
}

export function getPlayerHand(player) {
  // 获取玩家的手牌
  let playerHandElement = document.getElementById(`${player}-hand`);
  let playerHand = [];
  for (let cardElement of playerHandElement.children) {
    playerHand.push(cardElement.textContent);
  }
  return playerHand;
}

export function getNextPlayer(currentPlayer, players) {
  // 获取下一个出牌玩家
  let currentIndex = players.indexOf(currentPlayer);
  return players[(currentIndex + 1) % players.length];
}

export function getWinningPlayer(trick, trump) {
  // 确定本轮胜者
  let winningCard = trick[0];
  let winningPlayer = players[0];

  for (let i = 1; i < trick.length; i++) {
    if (beats(trick[i], winningCard, trump)) {
      winningCard = trick[i];
      winningPlayer = players[i];
    }
  }

  return winningPlayer;
}

export function beats(card1, card2, trump) {
  // 比较两张牌的大小
  let suit1 = getSuit(card1);
  let suit2 = getSuit(card2);
  let rank1 = getRank(card1);
  let rank2 = getRank(card2);

  if (suit1 === trump && suit2 !== trump) {
    return true;
  } else if (suit1 !== trump && suit2 === trump) {
    return false;
  } else {
    return rank1 > rank2;
  }
}

export function getRank(card) {
  // 获取牌的点数
  let rank = card.charAt(1);
  switch (rank) {
    case 'A':
      return 14;
    case 'K':
      return 13;
    case 'Q':
      return 12;
    case 'J':
      return 11;
    default:
      return parseInt(rank);
  }
}

export function getCardSymbol(card) {
  // 获取牌的花色符号
  let suit = getSuit(card);
  switch (suit) {
    case '♠':
      return '♠';
    case '♥':
      return '♥';
    case '♦':
      return '♦';
    case '♣':
      return '♣';
  }
}

export function getCardRank(card) {
  // 获取牌的点数符号
  let rank = card.charAt(1);
  switch (rank) {
    case 'A':
      return 'A';
    case 'K':
      return 'K';
    case 'Q':
      return 'Q';
    case 'J':
      return 'J';
    default:
      return rank;
  }
}

export function getSuit(card) {
  // 获取牌的花色
  return card.charAt(0);
}

export function calculateScore(trick) {
  // 计算本轮得分
  let score = 0;
  for (let card of trick) {
    if (card === '5' || card === '10' || card.charAt(1) === 'K') {
      score += 10;
    }
  }
  return score;
}

export function isGameOver(deck, players) {
  // 检查游戏是否结束
  return deck.length === 0;
}

export function getWinner(scores) {
  // 确定最终胜利
  // 实现获胜逻辑
}

export async function updatePlayerHands(player, card) {
  let playerHandElement = document.getElementById(`${player}-hand`);
  let cardElement = createCardElement(card);
  playerHandElement.appendChild(cardElement);
}

export function createCardElement(card, trump) {
  let cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.textContent = `${getCardSymbol(card)}${getCardRank(card)}`;
  if (getSuit(card) === trump) {
    cardElement.style.color = 'red';
  }
  return cardElement;
}
