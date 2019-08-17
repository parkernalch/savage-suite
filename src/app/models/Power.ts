interface _Power {
    name:string;
    ruletext:string;
    rank: number;
}

export interface _PowerInstance {
    name: string;
    trapping: string;
    cost: number;
    effect: string;
    power: _Power;
    range: string;
    duration: string;
    sustain?: string;
    notes?: string;
}

export default _Power;