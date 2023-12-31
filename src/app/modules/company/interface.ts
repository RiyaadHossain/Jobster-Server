export type ICompany = {
  id: string;
  name: string;
  logo: string;
  banner: string;
  phoneNumber: string;
  companySize: string;
  founded: string;
  location: string;
  industry: string;
  about: string;
  galleries: string[];
  website: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
};
