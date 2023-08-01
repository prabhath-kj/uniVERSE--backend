import nodeMailer from "nodemailer"
import { google } from "googleapis"
import * as dotenv from "dotenv"
dotenv.config()
const OAuth2=google.auth.OAuth2


console.log(
  {
    "clientID":process.env.clientID,
    "clientSecret":process.env.clientSecret,
    "refreshToken":process.env.refreshToken,
    "service":process.env.SERVICE
  }
);
const OAuth2_client=new OAuth2(process.env.clientID,process.env.clientSecret)
OAuth2_client.setCredentials({refresh_token:process.env.refreshToken})

const sendMail = async (email, subject, text) => {
  try {
    const accessToken = await OAuth2_client.getAccessToken();
   console.log("access",accessToken);
    const transporter = nodeMailer.createTransport({
      service:process.env.SERVICE,
      auth: {
        type:"OAuth2",
        user: process.env.USER,
        clientId:process.env.clientID,
        clientSecret:process.env.clientSecret,
        refreshToken: process.env.refreshToken,
        accessToken:accessToken,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    // Send the email using the transporter
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });

    console.log("Email sent");
  } catch (err) {
    console.error(err);
  }
};

export default sendMail