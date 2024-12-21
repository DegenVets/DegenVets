const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; 

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rate limit
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 1, 
    message: 'Too many submissions from this IP, please try again after an hour.',
});

app.post('/submit', limiter, async (req, res) => {
    const { firstname, lastname, email, phone, message } = req.body;

    if (!firstname || !lastname || !email || !phone || !message) {
        return res.status(400).send('All fields are required.');
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, 
        port: process.env.SMTP_PORT || 587, 
        secure: process.env.SMTP_SECURE === 'true', 
        auth: {
            user: process.env.SMTP_USER, 
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: `"Degen Vets Form" <${process.env.SMTP_USER}>`,
        to: process.env.RECEIVER_EMAIL, 
        subject: 'New Contact Form Submission',
        text: `
First Name: ${firstname}
Last Name: ${lastname}
Email: ${email}
Phone: ${phone}
Message:
${message}
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Message sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send the message.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
