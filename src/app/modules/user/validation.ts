import { z } from 'zod';
import { ENUM_USER_ROLE } from '../../../enums/user';

const signUp = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
    role: z.enum([...Object.values(ENUM_USER_ROLE)] as [string, ...string[]]),
    password: z.string({ required_error: 'Password is required' }),
    phoneNumber: z.string({ required_error: 'Phone Number is required' }),
    candidate: z.string(),
    company: z.string(),
    admin: z.string(),
  }),
});

export const UserValidations = { signUp };
