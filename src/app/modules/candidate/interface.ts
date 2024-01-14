export type ICandidate = {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  phoneNumber: string;
  location: string;
  industry: string;
  about: string;
  skills: string[];
  resume: { fileName: string; fileURL: string };
  workExperience: {
    timePeriod: string;
    position: string;
    company: string;
    details: string;
  }[];
  educationTraining: {
    timePeriod: string;
    courseName: string;
    institution: string;
    details: string;
  }[];
};
