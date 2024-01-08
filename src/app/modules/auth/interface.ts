export type IUserCredential = {
  id: string;
  email: string;
  password: string;
  oldPassword?: string;
  newPassword?: string;
};

export type IResetCredential = {
  token: string;
  newPassword: string
}