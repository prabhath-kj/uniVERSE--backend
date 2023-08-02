import {createTransport} from "nodemailer";
import * as dotenv from "dotenv"
dotenv.config()

const sendMail = async (email, subject, text) => {
  try {
    const transporter = createTransport({
      host:process.env.HOST,
      service:process.env.SERVICE,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    // Send the email using the transporter
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });
  } catch (err) {
    console.error(err);
  }
};

export default sendMail;
