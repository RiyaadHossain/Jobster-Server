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
    location: z.string().optional(),
    industry: z.string().optional(),
    about: z.string().optional(),
    galleries: z.string().optional(),
    website: z.string().optional(),
    socialLinks: z
      .object({
        facebook: z.string(),
        twitter: z.string(),
        instagram: z.string(),
        linkedin: z.string(),
      })
      .optional(),
  }),
});

export const CompanyValidations = { editProfile };
