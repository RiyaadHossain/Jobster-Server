import { z } from 'zod';

const apply = z.object({
  body: z.object({
    job: z.string({ required_error: 'Job Id is required' }),
  }),
});

export const ApplicationValidations = { apply };
