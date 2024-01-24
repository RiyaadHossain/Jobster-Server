import { ENUM_INDUSTRY } from '@/enums/industry';
import {
  ENUM_EMPLOYMENT_TYPE,
  ENUM_JOB_STATUS,
  ENUM_WORK_LEVEL,
} from '@/enums/job';
import { ENUM_LOCATION } from '@/enums/location';
import { z } from 'zod';

const createJob = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is Required' }),
    industry: z.enum([...Object.values(ENUM_INDUSTRY)] as [
      string,
      ...string[]
    ]),
    description: z.string({ required_error: 'Description is Required' }),
    location: z.enum([...Object.values(ENUM_LOCATION)] as [
      string,
      ...string[]
    ]),
    status: z
      .enum([...Object.values(ENUM_JOB_STATUS)] as [string, ...string[]])
      .optional(),
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
    industry: z
      .enum([...Object.values(ENUM_INDUSTRY)] as [string, ...string[]])
      .optional(),
    description: z.string().optional(),
    experience: z.string().optional(),
    workLevel: z
      .enum([...Object.values(ENUM_WORK_LEVEL)] as [string, ...string[]])
      .optional(),
    status: z
      .enum([...Object.values(ENUM_JOB_STATUS)] as [string, ...string[]])
      .optional(),
    employmentType: z
      .enum([...Object.values(ENUM_EMPLOYMENT_TYPE)] as [string, ...string[]])
      .optional(),
    salaryRange: z.string().optional(),
    skills: z.object({ title: z.string() }).array().optional(),
    requirements: z.object({ title: z.string() }).array().optional(),
    responsibilities: z.object({ title: z.string() }).array().optional(),
  }),
});

export const JobValidations = { createJob, updateJob };
