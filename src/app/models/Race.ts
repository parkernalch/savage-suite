import _Edge from './Edge';
import _Hindrance from './Hindrance';

interface _Race {
    id: string;
    name:string;
    description:string;
    features: _Edge[];
    hindrances: _Hindrance[];
    base_stats:{
        agility: number;
        smarts: number;
        spirit: number;
        strength: number;
        vigor: number;
    }
}

export default _Race;
