import { z } from 'zod';

const add = z.object({
  body: z.object({
    job: z.string({ required_error: 'Job Id is required' }),
  }),
});

export const WishlistValidations = { add };
