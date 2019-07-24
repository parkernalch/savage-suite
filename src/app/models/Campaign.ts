import { _SavageCharacter } from "./Character";
import  _ChroniclePost from "./ChroniclePost";

interface _Campaign {
    id:number;
    chronicle:_ChroniclePost[];
    party: _SavageCharacter[];
    sessions: Date[];
    next_session: Date[];
    motd: string;
    chat: _ChatMessage[];

    
}