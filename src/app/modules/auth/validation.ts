import { z } from 'zod';

const signIn = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const accessToken = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh Token is required' }),
  }),
});

const changePassword = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old Password is required' }),
    newPassword: z
      .string({ required_error: 'New Password is required' })
      .min(6)
      .max(32),
  }),
});

const forgetPassword = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Must be an email'),
  }),
});

const resetPassword = z.object({
  body: z.object({
    token: z.string({ required_error: 'Token is Invalid' }),
    newPassword: z
      .string({ required_error: 'New Password is required' })
      .min(6)
      .max(32),
  }),
});

export const AuthValidations = {
  signIn,
  accessToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
