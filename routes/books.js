const express = require('express');
const Book = require('../models/Book');
const Author = require('../models/author');

const router = express.Router();

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//all book route
router.get('/', async (req, res) => {

    let query = Book.find()
    if (req.query.title != null && req.query.title != "") {
        query = query.where('title', RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.render('Books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch (error) {
        res.redirect('/')
        console.log(error);

    }

})

//new book route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// create book route
router.post('/', async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
        category: req.body.category
    })
    saveCover(book, req.body.cover);
    try {
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)
    } catch (error) {
        console.log(error);

        renderNewPage(res, book, true)

    }
});

//show book route
router.get('/:id', async (req, res) => {

    try {
        const book = await Book.findById(req.params.id).populate('author').exec();
        res.render('Books/show', { book: book })
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})

//rating book
router.post('/rate-book/:id', async (req, res) => {
    let book;
    let result;
    try {
        book = await Book.findById(req.params.id);
        result = book.rating * book.noofRates;
        result += Number(req.body.rating);
        book.noofRates += 1;
        result /= book.noofRates;
        book.rating = result;
        await book.save();
        res.redirect(`/books/${req.params.id}`);
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
})

//edot book route
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        renderEditPage(res, book);
    } catch (error) {
        res.redirect('/')
    }
})

// update book route
router.put('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id);
        book.title = req.body.title;
        book.author = req.body.author;
        book.publishDate = new Date(req.body.publishDate);
        book.description = req.body.description;
        book.pageCount = req.body.pageCount;
        if (req.body.cover != null & req.body.cover !== "") {
            saveCover(book, req.body.cover)
        }
        console.log('kkjk');

        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch (error) {
        if (book != null) {
            renderEditPage(res, book, true)
        } else {
            res.redirect('/')
        }

    }
});

router.delete('/:id', async (req, res) => {
    let book;
    try {
        book = await Book.findById(req.params.id)
        await book.deleteOne();
        res.redirect('/books')
    } catch (error) {
        if (book !== null) {
            console.log(error);

            res.render('books/show', {
                book: book,
                errorMessage: "could not remove book"
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, 'new', hasError)

}

async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Editing Book';
            } else {
                params.errorMessage = 'Error cretaing Book';
            }
            console.log(error);
        }
        res.render(`Books/${form}`, params)
    } catch (error) {
        console.log(error);
        res.redirect('/Books')
    }
}


function saveCover(book, coverEncoded) {
    if (!coverEncoded) return;

    try {
        const cover = JSON.parse(coverEncoded);
        if (cover && imageMimeTypes.includes(cover.type)) {
            book.coverImage = Buffer.from(cover.data, 'base64');
            book.coverImageType = cover.type;
        }
    } catch (err) {
        console.error('Invalid JSON in coverEncoded:', err.message);
    }
}

module.exports = router