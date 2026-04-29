export type AuthPayload = {
  username: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: "bearer";
};

export type ProtectedResponse = {
  message: string;
  username: string;
};

export type ApiError = {
  detail?: string;
};