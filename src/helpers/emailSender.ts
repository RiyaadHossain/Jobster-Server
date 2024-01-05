import config from '@/config';
import ApiError from '@/errors/ApiError';
import { IEmail } from '@/interfaces/email';
import httpStatus from 'http-status';
import nodemailer from 'nodemailer';

export const emailSender = async (payload: IEmail) => {
  try {
    //Step 1: Creating the transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: config.EMAIL.NAME,
        pass: config.EMAIL.PASS,
      },
    });

    //Step 2: Setting up message options
    const messageOptions = {
      from: '"Jobster 💼" <jobster@gmail.com>',
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      // html: "",
    };

    //Step 3: Sending email
    transporter.sendMail(messageOptions);
  } catch (error) {
    throw new ApiError(httpStatus.FAILED_DEPENDENCY, 'Failed to send email');
  }
};
