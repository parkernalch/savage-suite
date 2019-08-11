import SavageCharacter, { _SavageCharacter } from "./Character";
import  _ChroniclePost from "./ChroniclePost";
import _ChatMessage from "./ChatMessage";

export default interface _Campaign {
    // id:number;
    name:string;
    description:string;
    chronicle:_ChroniclePost[];
    party: SavageCharacter[];
    sessions: Date[];
    next_session: Date;
    motd: string;
    chat: _ChatMessage[];
}