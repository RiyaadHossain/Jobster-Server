import { Schema, model } from 'mongoose';
import { ICompany } from './interface';

const companySchema = new Schema<ICompany>({
  id: { type: String, required: true },
  name: { type: String, required: true, minlength: 3, maxlength: 16 },
  profileView: { type: Number, default: 0 },
  logo: { type: String },
  banner: { type: String },
  phoneNumber: { type: String },
  about: { type: String },
  founded: { type: String },
  companySize: { type: String },
  location: { type: String },
  website: { type: String },
  galleries: [{ type: String }],
  industry: { type: String },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
  },
});

const Company = model<ICompany>('Company', companySchema);

export default Company;
