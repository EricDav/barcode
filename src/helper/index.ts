import { HttpException, HttpStatus } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { config } from '../config';

export const sendEmail = async (to, code) => {
    try {
      let transporter = nodemailer.createTransport({
        host: `mail.basecoininvest.co`,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: config.email,
          pass: config.emailPassword,
        },
      });
  
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: config.email, // sender address
        to, // list of receivers
        subject: 'Single Signin Code', // Subject line
        html: `<p>Hello <b>${to}</b>,<br>
          <p>Your code to signin to the barcode scanner app is:<p>.<br>
          <b>${code}</b><br>
          <p>The code above is only valid for two hours <br>Please ignore this email if you did not request for a code/p>
        </p>`, // html body
      });
  
      console.log('Message sent: %s', info.messageId);
    } catch (err) {
      console.log(err);
    }
};

export const handleErrorCatch = (err) => {
    if (
      err.status === HttpStatus.NOT_FOUND ||
      err.status === HttpStatus.BAD_REQUEST ||
      err.status === HttpStatus.UNAUTHORIZED
    ) {
      throw new HttpException(
        {
          status: err.status,
          error: err.response.error,
        },
        err.status,
      );
    }
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `An error occured with the message: ${err.message}`,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  };
