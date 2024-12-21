export type User = {
  fullname: string;
  email: string;
  password: string;
  picture_url?: string;
};

export type ProfileViewModel = {
  id: string;
  fullname: string | undefined;
  email: string;
  avatar: string | undefined;
};
