import _TraitBlock from './TraitBlock';
import _Hindrance from './Hindrance';
import _Edge from './Edge';
import _Power from './Power';
import _Race from './Race';

export interface _BaseCharacter {
    id:number;
    name:string;
    traits:_TraitBlock;
    race:_Race;
    description:string;
    portrait?:string;
    campaign?:string;
}

export interface _D5eCharacter extends _BaseCharacter {
    bonds?:string[];
    flaws?:string[];
    ideals?:string[];
}
export interface _SavageCharacter extends _BaseCharacter {
    edges:_Edge[];
    hindrances:_Hindrance[];
    powers:_Power[];
    rank:number;
}

export default class SavageCharacter implements _SavageCharacter {
    id:number;
    name:string;
    traits: _TraitBlock;
    race:_Race;
    description:string;
    edges:_Edge[];
    hindrances:_Hindrance[];
    powers:_Power[];
    rank:number;
    campaign?:string;

    deal_initiative:number;
    deal_tactician:number;
    deal_adventure:number;

    hand_cards: number[];
    tactician_cards?: number[];
    adventure_cards?: string[];
    
    isEdit:boolean;

    constructor(
        id:number,
        name:string,
        race:_Race, 
        campaign?:string,
        rank?:number, 
        edges?:_Edge[], 
        hindrances?:_Hindrance[], 
        powers?:_Power[]
    ){
        this.id = id;
        this.name = name;
        this.description = '';
        this.rank = rank || 0;
        this.race = race;
        this.campaign = campaign || 'unset';
        this.deal_adventure = this.rank;
        this.deal_initiative = 1;
        this.deal_tactician = 0;
        this.edges = edges || [];
        this.hindrances = hindrances || [];
        this.powers = powers || [];
        this.SetInitiative();
        this.isEdit = false;
    }

    toggleEdit(): void {
        this.isEdit = !this.isEdit;
    }

    SetInitiative(){
        for(let edge of this.edges){
            if(edge.initiative_cards) this.deal_initiative += edge.initiative_cards;
            if(edge.tactician_cards) this.deal_tactician += edge.tactician_cards;
            if(edge.adventure_cards) this.deal_adventure += edge.adventure_cards;
        }
    }

    Initiative() {
        return {
            initiative_cards: this.deal_initiative,
            tactician_cards: this.deal_tactician
        };
    }
    

}