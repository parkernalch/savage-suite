interface _Power {
    name:string;
    trapping:string;
    varities: _PowerInstance[];
}

interface _PowerInstance {
    cost: number;
    effect: string;
}

export default _Power;