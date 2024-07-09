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
