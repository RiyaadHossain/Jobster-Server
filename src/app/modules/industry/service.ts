import { ENUM_INDUSTRY } from '@/enums/industry';
import Job from '../job/model';

const jobOpenings = async () => {
  const data = await Promise.all(
    Object.values(ENUM_INDUSTRY).map(async industry => {
      const openings = await Job.countDocuments({ industry });
      return { industry, openings };
    })
  );

  return data;
};

export const IndustryServices = { jobOpenings };
