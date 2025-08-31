import { role } from "@/types";

export interface Token {
  access_token: string;
}

export interface LoginInterface {
  id: number;
  username: string;
  email: string;
  role: role;   
  token: Token;
  age?: string;
  phone?: string;
  address?: string;
}
