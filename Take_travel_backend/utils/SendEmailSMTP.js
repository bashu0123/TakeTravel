const nodemailer = require("nodemailer");

const sendMail = async (prop) => {
  // connect with the smtp
  let transporter = await nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass:process.env.MAIL_PASSWORD,
    },
  });

  let response_signup = {
        body: {
            name: "Fagoon GPT",
            intro: "Nepal's no 1 gpt",
            action: {
                instructions: "Click on the following button to login to Fagoon Gpt",
                button: {
                    text: "Verify User",
                    link: prop.url // replace with prop.url or the actual URL
                }
            },
            outro: "Welcome to Fagoon !!!"
        },
        subject: "Verify Email"
    };

  let response_resetPassword = {
        body: {
            name: "Fagoon GPT",
            intro: "Nepal's no 1 gpt",
            action: {
                instructions: "Click on the following button to reset password",
                button: {
                    text: "Reset Password",
                    link: prop.url // replace with prop.url or the actual URL
                }
            },
            outro: "Thankyou for choosing FagoonGPT !!!"
        },
        subject: "Reset Password"
    };

    let htmlContent;
    console.log("prop.type",prop.type)
    if(prop.type==="signup"){

        htmlContent = `
        <div>
            <h1>${response_signup.body.name}</h1>
            <p>${response_signup.body.intro}</p>
            <p>${response_signup.body.action.instructions}</p>
            <a href="${response_signup.body.action.button.link}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">
                ${response_signup.body.action.button.text}
            </a>
            <p>${response_signup.body.outro}</p>
        </div>
        `
    }else if(prop.type = "forgotPassword"){
        htmlContent = `
        <div>
            <h1>${response_resetPassword.body.name}</h1>
            <p>${response_resetPassword.body.intro}</p>
            <p>${response_resetPassword.body.action.instructions}</p>
            <a href="${response_resetPassword.body.action.button.link}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">
                ${response_resetPassword.body.action.button.text}
            </a>
            <p>${response_resetPassword.body.outro}</p>
        </div>
        `
    }

  let info = await transporter.sendMail({
    from: `"Fagoon" <${process.env.MAIL_USERNAME}>`, // sender address
    to: prop.email, // list of receivers
    subject: response_signup.subject, // Subject line
    text: response_signup.text, // plain text body
    html: htmlContent, // html body
  });

  return info;
};

module.exports = sendMail;
