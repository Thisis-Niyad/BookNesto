const express = require('express');
const Book = require('../models/Book')
const router = express.Router();

router.get('/', async (req, res) => {
    let books
    try {
        books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        books = [];
    }
    res.render('index', { books: books })
})


module.exports = router