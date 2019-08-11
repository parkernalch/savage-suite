import { _PowerInstance } from './Power';

export default class Item {
    type: string;
    item: string;
    cost: number;
    weight: number;
    notes: string;

    // Melee weapon specific props
    mWeaponType?: string;
    mWeaponDamage?: string;

    // Armor specific props
    armorType?: string;
    armorMod?: number;

    // Ranged Weapon Properties
    rWeaponType?: string;
    rWeaponDamage?: number;
    rWeaponShortRange?: number;
    rWeaponMidRange?: number;
    rWeaponLongRange?: number;
    rWeaponRateOfFire?: number;
    rWeaponMinStrength?: number;
    rWeaponShots?: number;

    // Ammo Properties
    ammoType?: string;

    // Special Weapon properties
    sWeaponType?: string;
    sWeaponAP?: number;
    sWeaponBurst?: string;

    // Magic Item Properties
    magicItemType?: string;
    magicItemPP?: number;
    magicItemPowers?: _PowerInstance[];
    magicItemDescription?: string;

    constructor(type:string, name:string, cost:number, weight:number, notes:string, additionalProps:Object) {
        this.type = type;
        this.item = name;
        this.cost = cost;
        this.weight = weight;
        this.notes = notes;

        switch(this.type){
            case "melee":
                this.loadMeleeProps(additionalProps);
                break;
            case "range":
                this.loadRangedProps(additionalProps);
                break;
            case "ammo":
                this.loadAmmoProps(additionalProps);
                break;
            case "special":
                this.loadSpecialProps(additionalProps);
                break;
            case "magic":
                this.loadMagicProps(additionalProps);
                break;
            default:
                this.loadMundaneProps(additionalProps);
                break;
        } 
    }

    loadMeleeProps(props: Object){
        for(let key of Object.keys(props)){
            switch(key){
                case "type":
                    this.mWeaponType = props[key];
                    break;
                case "damage":
                    this.mWeaponDamage = props[key];
                    break;
                default:
                    continue;
            }
        }
    } 
    
    loadRangedProps(props: Object){
        for(let key of Object.keys(props)){
            switch(key){
                case "type":
                    this.rWeaponType = props[key];
                    break;
                case "shortRange":
                    this.rWeaponShortRange = props[key];
                    break;
                case "midRange":
                    this.rWeaponMidRange = props[key];
                    break;
                case "longRange":
                    this.rWeaponLongRange = props[key];
                    break;
                case "minStrength":
                    this.rWeaponMinStrength = props[key];
                    break;
                case "RoF":
                    this.rWeaponRateOfFire = props[key];
                    break;
                case "shots":
                    this.rWeaponShots = props[key];
                    break;
                default:
                    continue;
            }
        }
    }

    loadAmmoProps(props: Object){
        for(let key of Object.keys(props)){
            switch(key){
                case "type":
                    this.ammoType = props[key];
            }
        } 
    }

    loadSpecialProps(props: Object){
        for(let key of Object.keys(props)){
            switch(key){
                case "type":
                    this.sWeaponType = props[key];
                    break;
                case "burst":
                    this.sWeaponBurst = props[key];
                    break;
                case "ap":
                    this.sWeaponAP = props[key];
                    break;
                default:
                    continue;
            }
        } 
    }

    loadMagicProps(props: Object){
        for(let key of Object.keys(props)){
            switch(key) {
                case "type":
                    this.magicItemType = props[key];
                    break;
                case "description":
                    this.magicItemDescription = props[key];
                    break;
                case "powers":
                    let powers: _PowerInstance[]; 
                    for(let power of Object.keys(props[key])){
                        let _p: _PowerInstance;
                        _p.name = props[key][power].name;
                        _p.cost = props[key][power].cost;
                        _p.effect = props[key][power].effect;
                        powers.push(_p);
                    }
                    this.magicItemPowers = powers;
                    break;
                case "pp":
                    this.magicItemPP = props[key];
            }
        } 
    }

    loadMundaneProps(props: Object){
        console.log("loading mundane props", props);
    }
}