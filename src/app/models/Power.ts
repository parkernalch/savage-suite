interface _Modifier {
    id:string;
    name:string;
    effect:string;
    additional_cost:number
}

interface _Power {
    id: string;
    name:string;
    ruletext:string;
    rank: number;
    cost:number;
    specialCost?:string;
    range:string;
    duration:string;
    effect:string;
    modifiers: _Modifier[];
    creator:string;
}

export interface _PowerInstance {
    id: string;
    name: string;
    trapping: string;
    cost: number;
    effect: string;
    power: _Power;
    range: string;
    duration: string;
    sustain?: string;
    notes?: string;
    creator: string;
}

export default _Power;