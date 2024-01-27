import ApiError from '@/errors/ApiError';
import Candidate from '../candidate/model';
import { IWishlist, IWishlistPopulated } from './interface';
import httpStatus from 'http-status';
import Wishlist from './model';
import Job from '../job/model';

const add = async (payload: IWishlist, userId: string) => {
  const candidate = await Candidate.findOne({ id: userId });
  if (!candidate)
    throw new ApiError(httpStatus.NOT_FOUND, 'Candidate account not found');

  const job = await Job.findById(payload.job);
  if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job data not found');

  const isExist = await Wishlist.findOne({
    candidate: candidate._id,
    job: job._id,
  });
  if (isExist)
    throw new ApiError(httpStatus.NOT_FOUND, 'Already added in wishlist');

  payload.candidate = candidate._id;

  const data = await Wishlist.create(payload);
  return data;
};

const myList = async (userId: string, searchTerm: string) => {
  const candidate = await Candidate.findOne({ id: userId });
  if (!candidate)
    throw new ApiError(httpStatus.NOT_FOUND, 'Candidate account not found');

  const data: IWishlistPopulated[] = await Wishlist.find({
    candidate: candidate._id,
  }).populate({
    path: 'job',
    select: '_id title company industry employmentType location',
    populate: { path: 'company', select: '_id name logo industry location' },
  });

  let filteredData = data;
  if (searchTerm)
    filteredData = data.filter(item => {
      searchTerm = searchTerm?.toLowerCase();
      const jobTitle = item?.job?.title?.toLowerCase();
      const companyName = item?.job?.company?.name?.toLowerCase();

      // @ts-ignore
      return jobTitle.includes(searchTerm) || companyName.includes(searchTerm);
    });

  return filteredData;
};

const alreadyAdded = async (jobId: string, userId: string) => {
  const candidate = await Candidate.findOne({ id: userId });
  if (!candidate)
    throw new ApiError(httpStatus.NOT_FOUND, 'Candidate account not found');

  const isAdded = await Wishlist.findOne({
    candidate: candidate._id,
    job: jobId,
  });

  return !!isAdded;
};

const remove = async (id: string, userId: string) => {
  const candidate = await Candidate.findOne({ id: userId });
  if (!candidate)
    throw new ApiError(httpStatus.NOT_FOUND, 'Candidate account not found');

  const wishlist = await Wishlist.findById(id);
  if (!wishlist)
    throw new ApiError(httpStatus.NOT_FOUND, 'Wishlist item not found');

  if (!wishlist.candidate.equals(candidate._id))
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This item is not included in your wishlist'
    );

  const data = await Wishlist.findByIdAndDelete(id);
  return data;
};

export const WishlistServices = { add, myList, alreadyAdded, remove };
