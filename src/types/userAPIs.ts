import  {role , provider} from "./common-types";

export type UserResponse = {
    id: string;
    username: string;
    age?: number;
    email?: string;
    phone?: string;
    address?: string;
    role?: role;
    provider?: provider;
    userSummary?: string;
    profilePicture?: string;
    };