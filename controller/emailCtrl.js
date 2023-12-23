const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async(data,req,res)=>{

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'harshittiet92@gmail.com',
          pass: 'nbmv aysg iaym ppvj'
        }
      });
      
      var mailOptions = {
        from: '"Hey 👻" <abc@gmail.com>', // sender address
          to: data.to, // list of receivers
          subject: data.subject, // Subject line
          text: data.text, // plain text body
          html: data.html,
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });



    // const transporter = nodemailer.createTransport({
    //     host: "smtp.gmail.com",
    //     port: 587,
    //     secure: false,
    //     auth: {
    //       // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    //       user: process.env.MAIL_ID,
    //       pass: process.env.MAIL_PASS,
    //     },
    //   });
      
    //   // async..await is not allowed in global scope, must use a wrapper
    //   async function main() {
    //     // send mail with defined transport object
    //     const info = await transporter.sendMail({
    //       from: '"Hey 👻" <abc@gmail.com>', // sender address
    //       to: data.to, // list of receivers
    //       subject: data.subject, // Subject line
    //       text: data.text, // plain text body
    //       html: data.html, // html body
    //     });
      
    //     console.log("Message sent: %s", info.messageId);
    // }
    //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
});

module.exports = sendEmail;