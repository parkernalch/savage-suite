// import SavageCharacter from './Character';

export default interface _ChatMessage {
    // user: SavageCharacter;
    user: string;
    message: string;
    date: Date;
    tags: string[];
}