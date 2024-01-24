import { ENUM_INDUSTRY } from '@/enums/industry';
import { ENUM_LOCATION } from '@/enums/location';
import { z } from 'zod';

const editProfile = z.object({
  body: z.object({
    name: z.string().optional(),
    profileView: z.string().optional(),
    logo: z.string().optional(),
    banner: z.string().optional(),
    phoneNumber: z.string().optional(),
    location: z
      .enum([...Object.values(ENUM_LOCATION)] as [string, ...string[]])
      .optional(),
    industry: z
      .enum([...Object.values(ENUM_INDUSTRY)] as [string, ...string[]])
      .optional(),
    title: z.string().optional(),
    about: z.string().optional(),
    skills: z.object({ title: z.string() }).array().optional(),
    workExperience: z
      .object({
        timePeriod: z.string(),
        position: z.string(),
        company: z.string(),
        details: z.string(),
      })
      .array()
      .optional(),
  }),
  educationTraining: z
    .object({
      timePeriod: z.string(),
      degreeName: z.string(),
      institution: z.string(),
      details: z.string(),
    })
    .array()
    .optional(),
});

export const CandidateValidations = { editProfile };
