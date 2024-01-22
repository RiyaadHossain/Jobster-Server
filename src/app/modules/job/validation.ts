import { ENUM_EMPLOYMENT_TYPE, ENUM_WORK_LEVEL } from '@/enums/job';
import { z } from 'zod';

const createJob = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is Required' }),
    category: z.string({ required_error: 'Category is Required' }),
    description: z.string({ required_error: 'Description is Required' }),
    location: z.string({ required_error: 'Location is Required' }),
    experience: z.string({ required_error: 'Experience is Required' }),
    workLevel: z.enum([...Object.values(ENUM_WORK_LEVEL)] as [
      string,
      ...string[]
    ]),
    employmentType: z.enum([...Object.values(ENUM_EMPLOYMENT_TYPE)] as [
      string,
      ...string[]
    ]),
    salaryRange: z.string({ required_error: 'Salary Range is Required' }),
    skills: z.object({ title: z.string() }).array().optional(),
    requirements: z.object({ title: z.string() }).array().optional(),
    responsibilities: z.object({ title: z.string() }).array().optional(),
  }),
});

const updateJob = z.object({
  body: z.object({
    title: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    experience: z.string().optional(),
    workLevel: z.string().optional(),
    employmentType: z.string().optional(),
    salaryRange: z.string().optional(),
    skills: z.object({ title: z.string() }).array().optional(),
    requirements: z.object({ title: z.string() }).array().optional(),
    responsibilities: z.object({ title: z.string() }).array().optional(),
  }),
});

export const JobValidations = { createJob, updateJob };
