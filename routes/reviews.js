const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const existingReview = await Review.findOne({
      book: req.params.id,
      user: req.user.userId,
    });
    if (existingReview) return res.status(400).json({ error: 'Review already exists' });

    const { rating, comment } = req.body;
    const review = new Review({
      book: req.params.id,
      user: req.user.userId,
      rating,
      comment,
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { rating, comment } = req.body;
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await review.remove();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;