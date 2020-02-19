import SavageCharacter, { _SavageCharacter } from "./Character";
import  _ChroniclePost from "./ChroniclePost";
import _ChatMessage from "./ChatMessage";
import _Edge from './Edge';
import _Hindrance from './Hindrance';
import _Power from './Power';
import _Race from './Race';

export default interface _Campaign {
    id:string;
    name:string;
    description:string;
    chronicle:_ChroniclePost[];
    party: SavageCharacter[];
    sessions: Date[];
    next_session: Date;
    motd: string;
    chat: _ChatMessage[];
    imagepath?: string;
    custom_content?: {
        edges: _Edge[];
        hindranes: _Hindrance[];
        powers: _Power[];
        races: _Race[];
    }
}