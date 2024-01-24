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
    companySize: z.string().optional(),
    founded: z.string().optional(),
    location: z
      .enum([...Object.values(ENUM_LOCATION)] as [string, ...string[]])
      .optional(),
    industry: z
      .enum([...Object.values(ENUM_INDUSTRY)] as [string, ...string[]])
      .optional(),
    about: z.string().optional(),
    galleries: z.string().array().optional(),
    website: z.string().optional(),
    socialLinks: z
      .object({
        facebook: z.string().optional(),
        twitter: z.string().optional(),
        instagram: z.string().optional(),
        linkedin: z.string().optional(),
      })
      .optional(),
  }),
});

export const CompanyValidations = { editProfile };
