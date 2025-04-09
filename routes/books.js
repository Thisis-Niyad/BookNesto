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
    })
    saveCover(book, req.body.cover);
    try {
        const newBook = await book.save()
        res.redirect('books')
    } catch (error) {
        renderNewPage(res, book, true)

    }
});

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) {
            params.errorMessage = 'Error cretaing Book'
            console.log(error);

        }
        res.render('Books/new', params)
    } catch {
        res.redirect('/Books')
    }
}

// function removeBookCover(fileName) {
//     fs.unlink(path.join(uploadPath, fileName), err => {
//         if (err) { console.error(err); }
//     })
// }
function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded);
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type
    }

}
module.exports = router