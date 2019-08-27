import _TraitBlock from './TraitBlock';
import _Hindrance from './Hindrance';
import _Edge from './Edge';
import _Power, { _PowerInstance } from './Power';
import _Race from './Race';
import Item from './Item';
import _Campaign from './Campaign';

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

export default class SavageCharacter {
    id:string;
    name:string;
    traits: _TraitBlock;
    race:_Race;
    description:string;
    class?:string;
    edges:_Edge[];
    hindrances:_Hindrance[];
    powers:_PowerInstance[];
    rank:number;
    // campaign?:_Campaign;

    deal_initiative:number;
    deal_tactician:number;
    deal_adventure:number;

    hand_cards: number[];
    tactician_cards?: number[];
    adventure_cards?: string[];

    equipment: Item[];

    constructor(
        id:string,
        name:string,
        race?:_Race, 
        // campaign?:_Campaign,
        rank?:number, 
        edges?:_Edge[], 
        hindrances?:_Hindrance[], 
        powers?:_PowerInstance[]
    ){
        this.id = id;
        this.name = name;
        this.description = '';
        this.rank = rank || 0;
        this.race = race || null;
        // this.campaign = campaign || null;
        this.deal_adventure = this.rank;
        this.deal_initiative = 1;
        this.deal_tactician = 0;
        this.edges = edges || [];
        this.hindrances = hindrances || [];
        this.powers = powers || [];
        this.traits = {
            attributes: [
                {
                    name: "agility",
                    level: 0,
                    modifier: 0
                },
                {
                    name: "smarts",
                    level: 0,
                    modifier: 0
                },
                {
                    name: "spirit",
                    level: 0,
                    modifier: 0
                },
                {
                    name: "strength",
                    level: 0,
                    modifier: 0
                },
                {
                    name: "vigor",
                    level: 0,
                    modifier: 0
                }
            ],
            skills: [ ]
        }
        this.SetInitiative();
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

export interface dbCharacter {
    _id: string;
    name: string;
    traits: {
        attributes: [
            {
                name: string;
                level: number;
                modifier: number;
            }
        ],
        skills: [
            {
                name: string;
                linked_attribute: string;
                description: string;
                level: number;
                modifier: number;
                trained: boolean;
            }
        ]
    },
    race: {
        _id: string;
        name: string;
        description: string;
        features: [
            {
                type: string;
                name: string;
                description: string;
                effect: string;
                prerequisites: string[];
                initiative_cards: number;
                tactician_cards: number;
                adventure_cards: number;
                creator: string;
                rank: number;
                racialAbilityCost: number;
                racialAbilityCount: number; 
            }
        ];
        hindrances: [
            {
                name: string;
                type: string;
                description: string;
                major: boolean;
                racialAbilityCost: number;
                racialAbilityCount: number;
                creator: string; 
            }
        ];
        base_stats: {
            agility: number;
            smarts: number;
            spirit: number;
            strength: number;
            vigor: number;
        };
        creator: string;
    };
    description: string;
    edges: [
        {
            type: string;
            name: string;
            description: string;
            effect: string;
            prerequisites: string[];
            initiative_cards: number;
            tactician_cards: number;
            adventure_cards: number;
            creator: string;
            rank: number;
            racialAbilityCost: number;
            racialAbilityCount: number;
        }
    ];
    hindrances: [
        {
            name: string;
            type: string;
            description: string;
            major: boolean;
            racialAbilityCost: number;
            racialAbilityCount: number;
            creator: string;
        }
    ];
    powers: [
        {
            name: string;
            trapping: string;
            cost: number;
            effect: number;
            power: {
                name: string;
                rank: number;
                cost: number;
                specialCost?: string;
                range: string;
                duration: string;
                effect: string;
                ruletext: string;
                modifiers: [
                    {
                        name: string;
                        effect: string;
                        additional_cost: number;
                    }
                ];
                creator: string;
            };
            range: string;
            duration: string;
            sustain: string;
            notes: string;
            creator: string
        }
    ];
    rank: number;
    deal_initiative: number;
    deal_tactician: number;
    deal_adventure: number;
    hand_cards: number[];
    tactician_cards: number[];
    adventure_cards: number[];
    equipment: [
        {
            type: string;
            item: string;
            cost: number;
            weight: number;
            notes: string;
            mWeaponType?:string;
            mWeaponDamage?:string;
            armorType?:string;
            armorMod?:number;
            rWeaponType?:string;
            rWeaponDamage?:string;
            rWeaponShortRange?: number;
            rWeaponMidRange?: number;
            rWeaponLongRange?: number;
            rWeaponRateOfFire?: number;
            rWeaponMinStrength?: number;
            rWeaponShots?: number;
            ammoType?:string;
            sWeaponType?:string;
            sWeaponAP:number;
            sWeaponBurst: string;
            magicItemType:string;
            magicItemPP:string;
            magicItemPower:{
                name: string;
                rank: number;
                cost: number;
                specialCost?: string;
                range: string;
                duration: string;
                effect: string;
                ruletext: string;
                modifiers: [
                    {
                        name: string;
                        effect: string;
                        additional_cost: number;
                    }
                ];
                creator: string; 
            };
            magicItemDescription:string;
            creator: string;
        }
    ];
    user: string;
}