export type Player={fullName:string;jerseyNumber:number;position:string;jerseySize:"S"|"M"|"L"|"XL"|"XXL";phone:string};
export type TeamPayload={teamNumber:number;companyName:string;email:string;managerName:string;phone:string;captainName:string;captainPhone:string;players:Player[];logoFileName:string;brandGuidelinesFileName?:string};
