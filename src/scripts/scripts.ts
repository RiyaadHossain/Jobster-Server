import Job from '@/app/modules/job/model';

export const unsetFields = async () => {
  const result = await Job.updateMany(
    {},
    { $unset: { skills: 1, requirements: 1, responsibilities: 1 } },
    { multi: true }
  );

  console.log(result);
};
