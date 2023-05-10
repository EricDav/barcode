import { HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios'

export const sendEmail = async (to, code) => {
    try {

      const subject = 'Single Signin Code';
      const html = `<p>Hello <b>${to}</b>,<br>
      <p>Your code to signin to the barcode scanner app is:<p>.<br>
      <b>${code}</b><br>
      <p>The code above is only valid for two hours <br>Please ignore this email if you did not request for a code</p>`;
      await axios.post('https://apimdevtech.azure-api.net/fmsnotification/v1/notification/email', {
        to,
        subject,
        html
      });
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
