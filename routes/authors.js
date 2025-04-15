const express = require('express');
const Author = require('../models/author');
const router = express.Router();
const books = require('../models/Book')
//all authors route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name !== null && req.query.name !== "") {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', { authors: authors, searchOptions: req.query })
    } catch {
        res.redirect('/')
    }
})

//new author route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

// create author route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    });
    try {
        const newAuthor = await author.save();
        res.redirect(`/authors/${author.id}`); // Redirect after successful save
    } catch (err) {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating author'
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const book = await books.find({ author: author.id }).limit(6).exec();
        res.render('authors/show', {
            author: author,
            booksByAuthor: book
        })
    } catch (error) {
        console.log(error);

        res.redirect('/');
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const book = await books.find({ author: req.params.id })
        const author = await Author.findById(req.params.id)
        res.render('authors/edit',
            {
                author: author,
                bookByAuthor: book
            })
    } catch (error) {
        console.log(error);

        res.redirect('/authors')
    }
})

//deleting book in edit section
router.delete('/:id/:authorid', async (req, res) => {
    let book;
    try {
        book = await books.findById(req.params.id)
        await book.deleteOne();
        res.redirect(`/authors/${req.params.authorid}/edit`);
    } catch (error) {
        if (book !== null) {
            console.log(error);

            res.render('authors/show', {
                book: book,
                errorMessage: "could not remove book"
            })
        } else {
            res.redirect('/')
        }
    }
})


router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`); // Redirect after successful save
    } catch (error) {
        if (author == null) {
            res.redirect('/')
        } else {
            res.render('/authors/edit', {
                author: author,
                errorMessage: 'Error updating author'
            });
        }
    }
})

router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id);
        await author.deleteOne();
        res.redirect('/authors'); // Redirect after successful save
    } catch (err) {

        console.log(err);
        if (author == null) {
            res.redirect('/')
        } else {

            res.redirect(`/authors/${author.id}`);
        }
    }
})

module.exports = router