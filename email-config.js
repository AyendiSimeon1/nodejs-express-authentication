const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user:'ayendisimeon3@gmail.com',
        pass: '19ana156',
    },
});

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
