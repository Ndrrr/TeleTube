const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            //service: "Outlook365",
            //secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            from: process.env.EMAIL_USER,
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("[Email_Client]: email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

const buildRecoverUrl = (token) => {
    return `http://${process.env.BASE_URL}/reset-password/${token}`;
}

module.exports = {sendEmail, buildRecoverUrl};