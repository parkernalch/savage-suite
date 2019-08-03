interface _Power {
    name:string;
    trapping:string;
    varieties: _PowerInstance[];
}

export interface _PowerInstance {
    name: string,
    cost: number;
    effect: string;
}

export default _Power;