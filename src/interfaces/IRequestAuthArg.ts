export type AuthToken = { token: string };

export interface IRequestAuth {
  jwt?: AuthToken;
  oauth?: AuthToken;
  password?: string;
  username?: string;
}

export type IRequestAuthArg = string | IRequestAuth;
