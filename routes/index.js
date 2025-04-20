const express = require('express');
const Book = require('../models/Book')
const router = express.Router();

router.get('/', async (req, res) => {
    let latest
    let fantasy
    let thriller
    let sciencefiction
    let other
    try {
        latest = await Book.find().sort({ createdAt: 'desc' }).limit(15).exec()
        fantasy = await Book.find({ category: 'fantasy' }).limit(15).exec()
        thriller = await Book.find({ category: 'thriller' }).limit(15).exec()
        sciencefiction = await Book.find({ category: 'sciencefiction' }).limit(15).exec()
        other = await Book.find({ category: 'other' }).limit(15).exec()
    } catch (error) {
        console.log(error);

        books = [];
    }
    res.render('index', {
        latest: latest,
        fantasy: fantasy,
        thriller: thriller,
        sciencefiction: sciencefiction,
        other: other
    })
})


module.exports = router