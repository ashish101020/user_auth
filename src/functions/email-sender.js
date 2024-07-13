const sgMail = require('@sendgrid/mail');
const { SENDGRID_API, HOST_EMAIL } = require('./../constants/index.js');

sgMail.setApiKey(SENDGRID_API);

const sendMail = async (email, subject, text, html) => {
    try {
        const msg = {
            to: email, // Change to your recipient
            from: HOST_EMAIL, // Change to your verified sender
            subject,
            text,
            html,
        };
        await sgMail.send(msg);
        console.log("MAIL_SENT");
    } catch (error) {
        console.log("ERROR_MAILING", error.message);
    } finally {
        return;
    }
};

module.exports = sendMail;
