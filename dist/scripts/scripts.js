"use strict";
/* import Candidate from '../app/modules/candidate/model';
import Company from '../app/modules/company/model';
import Job from '../app/modules/job/model';
import User from '../app/modules/user/model';
import { ENUM_USER_ACCOUNT_STATUS, ENUM_USER_ROLE } from '../enums/user';
import { Utils } from '../utils/common';
import { promise } from 'zod';

export const unsetFields = async () => {
  const result = await User.updateMany(
    {},
    { $unset: { skills: 1, requirements: 1, responsibilities: 1 } },
    { multi: true }
  );

  console.log(result);
};

export const setUserName = async () => {
  const users = await User.find({ status: ENUM_USER_ACCOUNT_STATUS.IN_ACTIVE });

  await Promise.all(
    users.map(async user => {
      const email = user.email;
      const name = email.split('@')[0];

      if (!user?.name) user.name = Utils.makeFirstLetterUpperCase(name);

      await user.save();
    })
  );
};

export const removeHPFromName = async () => {
  const candidates = await Candidate.find({});

  await Promise.all(
    candidates.map(async candidate => {
      let name = candidate.name;

      name = name.split('-')[0] + ' ' + name.split('-')[1];
      candidate.name = name;
      await candidate.save();
    })
  );
};

export const makeAllUserAccountActive = async () => {
  const users = await User.find({ status: ENUM_USER_ACCOUNT_STATUS.IN_ACTIVE });

  await Promise.all(
    users.map(async user => {
      const role = user.role;
      user.status = ENUM_USER_ACCOUNT_STATUS.ACTIVE;

      if (role === ENUM_USER_ROLE.CANDIDATE) {
        if (!(await Candidate.findOne({ name: user.name })))
          await Candidate.create({ id: user.id, name: user.name });
      }
      if (role === ENUM_USER_ROLE.COMPANY) {
        if (!(await Company.findOne({ name: user.name })))
          await Company.create({ id: user.id, name: user.name });
      }

      user.name = undefined;

      await user.save();
    })
  );
};

export const setIdInUser = async () => {
  const users = await User.find();

  await Promise.all(
    users.map(async user => {
      const role = user.role;

      let userInfo = null;
      if (role === ENUM_USER_ROLE.CANDIDATE) {
        userInfo = await Candidate.findOne({ id: user.id });
        user.candidate = userInfo?._id;
      }
      if (role === ENUM_USER_ROLE.COMPANY) {
        userInfo = await Company.findOne({ id: user.id });
        user.company = userInfo?._id;
      }

      await user.save();
    })
  );
};
 */ 
