const express = require('express');
const Book = require('../models/Book')
const router = express.Router();

const requestIp = require('request-ip');
const axios = require('axios');
const UAparser = require('ua-parser-js');
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
    const ua = req.headers['user-agent'];
    const parser = new UAparser();
    parser.setUA(ua);
    const result = parser.getResult();
    const ip = requestIp.getClientIp(req) || req.ip || 'Unknown';

    let location = 'unknown';
    try {
        const locRes = await axios.get(`https://ipapi.co/${ip}/json/`);
        location = `
         city: ${locRes.data.city || 'Unknown'}, 
        Region: ${locRes.data.region || 'Unknown'}, 
        Country :${locRes.data.country_name || 'Unknown'}`;
    } catch (err) {
        console.error('Geo lookup failed:', err.message);
    }
    const deviceType = result.device.type || 'desktop';
    const deviceModel = result.device.model || 'unknown';
    const os = `${result.os.name || 'OS'} ${result.os.version || ''}`;
    const browser = `${result.browser.name || 'Browser'} ${result.browser.version || ''}`;

    const message = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: ' New User Login Alert BookNesto',
        text: `
        New login detected:
User ip address:${req.ip} 
 Device Type: ${deviceType}
 Model: ${deviceModel}
 OS: ${os}
 Browser: ${browser}
 User-Agent: ${ua}
 IP: ${ip}
Location: ${location}
Sent from your BookNesto tracker
`};



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