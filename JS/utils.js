function buildDeck() {
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

function shuffleDeck(deck) {
  // 洗牌算法
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function dealCards(deck, players) {
  // 发牌给4个玩家
  for (let i = 0; i < 54; i++) {
    for (let j = 0; j < players.length; j++) {
      let card = deck.pop();
      updatePlayerHands(players[j], card);
      setTimeout(() => {
        // 延迟1秒执行
      }, 1000);
    }
  }
}

function getDealer() {
  // 确定庄家
  let lastWinningTeam = localStorage.getItem('lastWinningTeam') || 'Player 1/Player 3';
  let [player1, player3] = lastWinningTeam.split('/');
  return Math.random() < 0.5 ? player1 : player3;
}

function getTrump(dealer) {
  // 确定主牌
  let validSuits = ['♠', '♥', '♦', '♣'];
  let trumpSuit = prompt(`${dealer}, please call the trump suit (${validSuits.join(', ')})`);
  while (!validSuits.includes(trumpSuit)) {
    trumpSuit = prompt('Invalid suit. Please call a valid trump suit.');
  }
  return trumpSuit;
}

function getValidCards(player, trick, trump) {
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

function getLeadingSuit(trick) {
  // 获取本轮领牌花色
  return getSuit(trick[0]);
}

function hasPlayerSuit(hand, suit) {
  // 检查玩家是否有某个花色的牌
  for (let card of hand) {
    if (getSuit(card) === suit) {
      return true;
    }
  }
  return false;
}

function getPlayerHand(player) {
  // 获取玩家的手牌
  let playerHandElement = document.getElementById(`${player}-hand`);
  let playerHand = [];
  for (let cardElement of playerHandElement.children) {
    playerHand.push(cardElement.textContent);
  }
  return playerHand;
}

function getNextPlayer(currentPlayer, players) {
  // 获取下一个出牌玩家
  let currentIndex = players.indexOf(currentPlayer);
  return players[(currentIndex + 1) % players.length];
}

function getWinningPlayer(trick, trump) {
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

function beats(card1, card2, trump) {
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

function getRank(card) {
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

function getCardSymbol(card) {
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

function getCardRank(card) {
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

function getSuit(card) {
  // 获取牌的花色
  return card.charAt(0);
}

function calculateScore(trick) {
  // 计算本轮得分
  let score = 0;
  for (let card of trick) {
    if (card === '5' || card === '10' || card.charAt(1) === 'K') {
      score += 10;
    }
  }
  return score;
}

function isGameOver(deck, players) {
  // 检查游戏是否结束
  return deck.length === 0;
}

function getWinner(scores) {
  // 确定最终胜利
