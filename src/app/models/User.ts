import _Role from './Role';

export interface _User {
    id: string;
    name:string;
    email:string;
    username:string;
    // password:string;
    // is_verified: boolean;
    role: _Role;
    register_date: Date;
}