class Deck {
    cards:number[];
    next_index:number;
    name_hash: {
        0: 'Two of Clubs',
        1: 'Two of Diamonds',
        2: 'Two of Hearts',
        3: 'Two of Spades',
        4: 'Three of Clubs',
        5: 'Three of Diamonds',
        6: 'Three of Hearts',
        7: 'Three of Spades',
        8: 'Four of Clubs',
        9: 'Four of Diamonds',
        10: 'Four of Hearts',
        11: 'Four of Spades',
        12: 'Five of Clubs',
        13: 'Five of Diamonds',
        14: 'Five of Hearts',
        15: 'Five of Spades',
        16: 'Six of Clubs',
        17: 'Six of Diamonds',
        18: 'Six of Hearts',
        19: 'Six of Spades',
        20: 'Seven of Clubs',
        21: 'Seven of Diamonds',
        22: 'Seven of Hearts',
        23: 'Seven of Spades',
        24: 'Eight of Clubs',
        25: 'Eight of Diamonds',
        26: 'Eight of Hearts',
        27: 'Eight of Spades',
        28: 'Nine of Clubs',
        29: 'Nine of Diamonds',
        30: 'Nine of Hearts',
        31: 'Nine of Spades',
        32: 'Ten of Clubs',
        33: 'Ten of Diamonds',
        34: 'Ten of Hearts',
        35: 'Ten of Spades',
        36: 'Jack of Clubs',
        37: 'Jack of Diamonds',
        38: 'Jack of Hearts',
        39: 'Jack of Spades',
        40: 'Queen of Clubs',
        41: 'Queen of Diamonds',
        42: 'Queen of Hearts',
        43: 'Queen of Spades',
        44: 'King of Clubs',
        45: 'King of Diamonds',
        46: 'King of Hearts',
        47: 'King of Spades',
        48: 'Ace of Clubs',
        49: 'Ace of Diamonds',
        50: 'Ace of Hearts',
        51: 'Ace of Spades',
        52: 'Red Joker',
        53: 'Black Joker'
    }


    constructor(deck?:Deck){
        if(deck){
            this.cards = deck.cards;
            this.next_index = deck.next_index;
        } else {
            for(let i=0;i<54;i++){
                this.cards.push(i);
            }
            this.next_index = 0;
        }
    }

    Shuffle() {
        let tempDeck = [];
        for(let s=54; s>0; s--){
            let r = Math.floor(Math.random() * s);
            tempDeck.push(this.cards[r]);
            this.cards.splice(r,1);
        }
        this.cards = tempDeck;
    }

    DealN(n:number){
        let output = [];
        for(let i=0; i<n; i++){
            if(this.next_index > 53){
                this.Shuffle();
            }
            output.push(this.cards[this.next_index]);
            this.next_index++;
        }
        return output;
    }

    CardName(card:number){
        return this.name_hash[card];
    }
}


export default Deck;