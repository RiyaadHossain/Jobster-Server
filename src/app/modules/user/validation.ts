import { ENUM_USER_ROLE } from '@/enums/user';
import { z } from 'zod';

const signUp = z.object({
  body: z.object({
    user: z.object({
      email: z.string({ required_error: 'Email is required' }).email(),
      role: z.enum([...Object.values(ENUM_USER_ROLE)] as [string, ...string[]]),
      password: z
        .string({ required_error: 'Password is required' })
        .min(6)
        .max(32),
    }),
    name: z.string({ required_error: 'Name is required' }),
  }),
});

export const UserValidations = { signUp };
