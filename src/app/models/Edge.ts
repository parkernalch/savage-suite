interface _Edge {
    id: string;
    type: string;
    name:string;
    description?:string;
    effect:string;
    prerequisites:string[];
    rank: number;
    initiative_cards?:number;
    tactician_cards?:number;
    adventure_cards?:number;
}

export default _Edge;
