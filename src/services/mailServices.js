import nodeMailer from "nodemailer"

const sendMail=async(email,subject,text)=>{
    try {
        const transporter = nodeMailer.createTransport({
          service: process.env.SERVICE,
          port: Number(process.env.EMAIL_PORT),
          secure: Boolean(process.env.SECURE),
          logger:true,
          secureConnection:false,
          debug:true,
          auth: {
            user: process.env.USER,
            pass: process.env.PASS,
          },
          tls:{
             rejectUnauthorized:true,
          },
        });
    
        await transporter.sendMail({
          from: process.env.USER,
          to: email,
          subject: subject,
          text: text,
        });
        console.log("Email sended");
    }
    catch(err){
        console.error(err);
    }
}
export default sendMail