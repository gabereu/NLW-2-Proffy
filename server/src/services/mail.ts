import nodemailer from 'nodemailer';

import mail from '../config/mail.json';

const transporter = nodemailer.createTransport({
    host: mail.host,
    port: mail.port,
    auth: {
      user: mail.user, // generated ethereal user
      pass: mail.pass, // generated ethereal password
    },
  });

  
export default transporter;