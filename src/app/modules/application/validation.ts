import { ENUM_APPLICATION_STATUS } from '@/enums/application';
import { z } from 'zod';

const apply = z.object({
  body: z.object({
    job: z.string({ required_error: 'Job Id is required' }),
  }),
});

const updateStatus = z.object({
  body: z.object({
    status: z.enum(
      Object.values(ENUM_APPLICATION_STATUS) as [string, ...string[]]
    ),
  }),
});

export const ApplicationValidations = { apply, updateStatus };
