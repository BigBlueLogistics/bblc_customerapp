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
  customer_code: string;
};

export type ResetPasswdType = {
  email: string;
};
