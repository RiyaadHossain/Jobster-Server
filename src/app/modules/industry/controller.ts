import catchAsync from "@/shared/catchAsync";
import sendResponse from "@/shared/sendResponse";
import { RequestHandler } from "express";
import httpStatus from "http-status";
import { IndustryServices } from "./service";

const jobOpenings: RequestHandler = catchAsync(async (req, res) => {
    const result = await IndustryServices.jobOpenings();
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Industry job opennings retrived successfully',
      data: result,
    });
});
  
export const IndustryControllers = {jobOpenings}