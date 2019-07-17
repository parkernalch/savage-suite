interface _Edge {
    name:string;
    description:string;
    effect:string;
    prerequisites:string[];
    initiative_cards?:number;
    tactician_cards?:number;
    adventure_cards?:number;
}

export default _Edge;