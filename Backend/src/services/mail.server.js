import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
    type: 'OAuth2',
    user:process.env.GOOGLE_USER,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    clientId:process.env.GOOGLE_CLIENT_ID,
    refreshToken:process.env.GOOGLE_REFRESH_TOKEN,
  },
  tls: {
    rejectUnauthorized: false 
  }
})

transporter.verify()
.then(()=>{console.log("Email transpoter is ready to send email")})
.catch((err)=>{console.log("Email transporter verification failed",err)})


export async function sendMail({to,subject,html,text}){
  const mailOption = {
    from: process.env.GOOGLE_USER,
to,subject,html,text
  }

  const details = await transporter.sendMail(mailOption)
  console.log("Email sent:", details);

}