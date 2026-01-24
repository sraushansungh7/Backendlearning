 import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); // ✅ loads root .env

// ✅ Create transporter ONCE
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SMTP_HOST,
  port: Number(process.env.MAILTRAP_SMTP_PORT),
  secure: false, // required for port 587
  auth: {
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS,
  },
});

console.log("SMTP CONFIG:", {
  host: process.env.MAILTRAP_SMTP_HOST,
  port: process.env.MAILTRAP_SMTP_PORT,
  user: process.env.MAILTRAP_SMTP_USER,
  pass: process.env.MAILTRAP_SMTP_PASS,
});


// ✅ Create Mailgen ONCE
const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Task Manager",
    link: "https://taskmanagelink.com",
  },
});

// ✅ sendEmail takes email as argument
const sendEmail = async ({ email, subject, mailgenContent }) => {
  try {
    const emailTextual = mailGenerator.generatePlaintext(mailgenContent);
    const emailHtml = mailGenerator.generate(mailgenContent);

    await transporter.sendMail({
      from: {
      address: "hello@demomailtrap.co",
      name: "My App",
    },
      to: email,
      subject,
      text: emailTextual,
      html: emailHtml,
    });

    console.log("✅ Email sent to", email);
  } catch (error) {
    console.error(
      "❌ Email service failed. Check MAILTRAP credentials in .env"
    );
    console.error(error);
  }
};

// ✅ SAME templates (no logic change)
const emailVerificationMailgenContent = (username, verficationUrl) => ({
  body: {
    name: username,
    intro: "Welcome to our App! we're excited to have you on board.",
    action: {
      instructions:
        "To verify your email please click on the following button",
      button: {
        color: "#22BC66",
        text: "Verify your email",
        link: verficationUrl,
      },
    },
    outro:
      "Need help, or have questions? Just reply to this email, we'd love to help.",
  },
});

const forgotPasswordMailgenContent = (username, passwordResetUrl) => ({
  body: {
    name: username,
    intro: "We got a request to reset the password of your account",
    action: {
      instructions:
        "To reset your password click on the following button or link",
      button: {
        color: "#22BC66",
        text: "Reset password",
        link: passwordResetUrl,
      },
    },
    outro:
      "Need help, or have questions? Just reply to this email, we'd love to help.",
  },
});

export {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
};
