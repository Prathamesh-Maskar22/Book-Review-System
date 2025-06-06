const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    const book = new Book({ title, author, genre, createdBy: req.user.userId });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;
    const query = {};
    if (author) query.author = new RegExp(author, 'i');
    if (genre) query.genre = new RegExp(genre, 'i');

    const books = await Book.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const { page = 1, limit = 10 } = req.query;
    const reviews = await Review.find({ book: req.params.id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'username')
      .exec();
    const count = await Review.countDocuments({ book: req.params.id });

    const avgRating = await Review.aggregate([
      { $match: { book: mongoose.Types.ObjectId(req.params.id) } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);

    res.json({
      book,
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      averageRating: avgRating[0]?.avgRating || 0,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter is required' });

    const books = await Book.find({
      $or: [
        { title: new RegExp(q, 'i') },
        { author: new RegExp(q, 'i') },
      ],
    });
    res.json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;