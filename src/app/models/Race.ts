import _Edge from './Edge';
import _Hindrance from './Hindrance';
interface _Base_Stats {
    agility: number;
    smarts: number;
    spirit: number;
    strength: number;
    vigor: number;
}

interface _Race {
    id: string;
    name:string;
    description:string;
    features: _Edge[];
    hindrances: _Hindrance[];
    base_stats: _Base_Stats;
    creator: string;
}

export default _Race;
