const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nnil77534@gmail.com',
    pass: 'shfc lcwj jbtl vhsx'
 }
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: 'nnil77534@gmail.com',
      to,
      subject,
      text
    });
    console.log("Email sent successfully to:", to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
