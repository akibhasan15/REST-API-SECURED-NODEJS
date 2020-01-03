require('dotenv').config({path:__dirname+'/./../../.env'})
const nodemailer=require('nodemailer');
const jwt =require('jwt-simple'); 


exports.UsingNodemailer=(user,info)=>{
  const EMAIL_SECRET = process.env.EMAIL_SECRET;     
    const SENDGRID_USERNAME = process.env.SENDGRID_USERNAME;
        const SENDGRID_PASSWORD = process.env.SENDGRID_PASSWORD;

 console.log("from SendMail",user)
 console.log("from SendMail",info )
 console.log("from SendMail,USERNAME & PASS",SENDGRID_USERNAME,SENDGRID_PASSWORD )


        const transporter = nodemailer.createTransport({
          service: "sendgrid",
          auth: {
            user: SENDGRID_USERNAME,
            pass: SENDGRID_PASSWORD
          }
        });
        let emailToken=jwt.encode(info,EMAIL_SECRET);
        const url = `http://localhost:3600/confirmation/${emailToken}`;

        const mailOptions = {
          from: "youremail@gmail.com",
          to: user.email,  
          subject: "Confirm Email",
          html: `Please click this email to confirm your email: <a href="${url}">Click Here To Confrim!</a>`
        };
        console.log("from SendMail",user.email)
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
}