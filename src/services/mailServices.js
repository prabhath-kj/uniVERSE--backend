import nodeMailer from "nodemailer"
import { google } from "googleapis"
import * as dotenv from "dotenv"
dotenv.config()
const OAuth2=google.auth.OAuth2



const OAuth2_client=new OAuth2("695901900553-pb8nekdm94438813lsm4321jlms1k5vd.apps.googleusercontent.com","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")
OAuth2_client.setCredentials({refresh_token:"1//04g0IhJ27CknOCgYIARAAGAQSNwF-L9IrWiUNUE-14ncex3BPq_16MVzI-M4a8nUuozS_O3oLJGQnQ0Ca1c0u4lJ3dI_ziy9Pd7I"})

const sendMail = async (email, subject, text) => {
  try {
  
    const transporter = nodeMailer.createTransport({
      service:"gmail",
      auth: {
        type:"OAuth2",
        user: process.env.USER,
        clientId:"695901900553-pb8nekdm94438813lsm4321jlms1k5vd.apps.googleusercontent.com",
        clientSecret:"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",
        refreshToken: "1//04g0IhJ27CknOCgYIARAAGAQSNwF-L9IrWiUNUE-14ncex3BPq_16MVzI-M4a8nUuozS_O3oLJGQnQ0Ca1c0u4lJ3dI_ziy9Pd7I",
        accessToken:await OAuth2_client.getAccessToken(),
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

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