import {createTransport} from "nodemailer";



const sendMail = async (email, subject, text) => {
  try {
    const transporter = createTransport({
      host: "smtp.gmail.com",
      service:"gmail",
      secure: false,
      auth: {
        user: "prabhathkj4@gmail.com",
        pass: "qexxvcbwwkcelywt",
      },
    });

    // Send the email using the transporter
    await transporter.sendMail({
      from: "prabhathkj4@gmail.com",
      to: email,
      subject: subject,
      text: text,
    });
  } catch (err) {
    console.error(err);
  }
};

export default sendMail;