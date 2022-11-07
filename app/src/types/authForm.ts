export type SignInFormType = {
  email: string;
  password: string;
};

export type SignUpFormType = {
  fname: string;
  lname: string;
  password: string;
  phone_no?: string;
  email: string;
  company: string;
};

export type ResetPassLinkType = {
  email: string;
};

export type ResetPassType = {
  password: string;
  confirm_password: string;
  email: string;
  token: string;
};
