import _Edge from './Edge';

interface _Race {
    id: string;
    name:string;
    description:string;
    features: _Edge[];
    base_stats:{
        agility: number;
        smarts: number;
        spirit: number;
        strength: number;
        vigor: number;
    }
}

export default _Race;