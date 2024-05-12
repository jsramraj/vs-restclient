export interface IConfig {
  name: string;
  description: string;
  users: IUser[];
}
export interface IUser {
  name: string;
  active: boolean;
  roles: string[];
}

export interface ICommand {
  action: CommandAction;
  content: IConfig;
}

export enum CommandAction {
  Save,
}

export type HttpConstant = { name: string; value: string };

export type HttpRequest = {
  name: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
};

export type HttpCollection = {
  name: string;
  constants: HttpConstant[];
  requests: HttpRequest[];
};

export type HttpContent = {
  collections: HttpCollection[];
};
