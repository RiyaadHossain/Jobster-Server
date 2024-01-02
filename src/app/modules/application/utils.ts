import Candidate from '../candidate/model';
import Job from '../job/model';

const isJobExist = async (id: string) => {
  const isExist = await Job.findById(id);
  return isExist;
};

const isCandidateExist = async (id: string) => {
  const isExist = await Candidate.findOne({ id });
  return isExist;
};

export const ApplicationUtils = { isJobExist, isCandidateExist };
