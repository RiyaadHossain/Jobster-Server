import catchAsync from '@/shared/catchAsync';
import sendResponse from '@/shared/sendResponse';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { WishlistServices } from './services';

const add: RequestHandler = catchAsync(async (req, res) => {
  const wishlistData = req.body;
  const userId = req.user?.userId;
  const result = await WishlistServices.add(wishlistData, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Job added to wishlist successfully',
    data: result,
  });
});

const myList: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const result = await WishlistServices.myList(userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Wishlist items retrived successfully',
    data: result,
  });
});

const remove: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const userId = req.user?.userId;
  const result = await WishlistServices.remove(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Wishlist item deleted successfully',
    data: result,
  });
});

export const WishlistControllers = { add, myList, remove };
