const mongoose = require('mongoose')
const Book = require('./Book')
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})


authorSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const books = await Book.find({ author: this._id });
    if (books.length > 0) {
        next(new Error('This author still has books.'));
    } else {
        next();
    }
});


module.exports = mongoose.model('Author', authorSchema)