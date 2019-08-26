interface _Hindrance {
    id: string;
    name:string;
    type: string;
    description:string;
    // if !major then minor
    major: boolean;
    racialAbilityCost?:number;
    racialAbilityCount?:number;
    creator:string;
}

export default _Hindrance;