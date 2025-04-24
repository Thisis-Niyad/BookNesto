const express = require('express');
const Book = require('../models/Book')
const router = express.Router();

const nodemailer = require('nodemailer');

// Set up the email transport configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});



router.get('/', async (req, res) => {
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip;

    const message = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: ' New User Login Alert BookNesto',
        text: `User ip address:${req.ip}   ,
               user agent${userAgent} `
    };


    let latest
    let fantasy
    let thriller
    let scienceFiction
    let other
    try {
        await transporter.sendMail(message);
        console.log('Email sent');

        latest = await Book.find().sort({ createdAt: 'desc' }).limit(15).exec()
        fantasy = await Book.find({ category: 'fantasy' }).limit(15).exec()
        thriller = await Book.find({ category: 'thriller' }).limit(15).exec()
        scienceFiction = await Book.find({ category: 'scienceFiction' }).limit(15).exec()
        other = await Book.find({ category: 'other' }).limit(15).exec()
    } catch (error) {
        console.log(error);

    }
    res.render('index', {
        latest: latest || [],
        fantasy: fantasy || [],
        thriller: thriller || [],
        scienceFiction: scienceFiction || [],
        other: other || []
    })
})


module.exports = router