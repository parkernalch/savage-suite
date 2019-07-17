import _SavageCharacter from './Character';
import Deck from './Deck';
import Encounter from './Encounter';

class Initiative {
    encounter:Encounter;
    deck:Deck;
    downed:_SavageCharacter[];
    combat_order:_SavageCharacter[];

    constructor(encounter:Encounter, deck?:Deck){
        this.encounter = encounter;
        if(deck){
            this.deck = deck;
        } else {
            this.deck = new Deck();
            this.deck.Shuffle;
        }
    }

    Start() {

    }
}