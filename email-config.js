const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host:'',
    port:456,
    service:'gmail',
    secure:'true',
    auth: {
        user:'ayendisimeon3@gmail.com',
        pass: '19ana156',
    }
});

async function main() {
    const info = await transporter.sendMail({
        from: "",
        to: "mrayendi1@gmail.com",
        subject:"Untitled Subject",
        text: "Hello World",
    });
    if(error){
        console.log('There was an error');
    } else {
        console('Message Sent Succesfully');
    }
}

console.log("Message:sent to ");


function sendConfirmationEmail(userEmail, confirmationCode) {
    const mailOptions = {
        from: 'ayendisimeon3@gmail.com',
        to: userEmail,
        subject: 'Confirmation Email',
        text : 'This is a confirmation email sent to you by me'
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('There was an error sending a mail to you');
        } else {
            console.log('Email sent to ' + info.response)
        }
    });
}

module.exports = { sendConfirmationEmail };