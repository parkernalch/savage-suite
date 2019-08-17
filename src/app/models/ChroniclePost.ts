import { _User } from './User';

interface _ChroniclePost {
    id: string;
    title:string;
    date_created:Date;
    date_edited:Date;
    content:string;
    type:string;
    tags:string[];
    author:_User;
}

export default _ChroniclePost;