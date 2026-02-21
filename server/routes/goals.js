const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');

// GET all goals (optionally filter by category)
router.get('/', async (req, res) => {
    try {
        const filter = req.query.category ? { category: req.query.category } : {};
        const goals = await Goal.find(filter).sort({ createdAt: -1 });
        res.json(goals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new goal
router.post('/', async (req, res) => {
    const { text, category } = req.body;
    if (!text || !category) {
        return res.status(400).json({ message: 'text and category are required' });
    }
    try {
        const goal = new Goal({ text, category });
        const saved = await goal.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a goal
router.delete('/:id', async (req, res) => {
    try {
        await Goal.findByIdAndDelete(req.params.id);
        res.json({ message: 'Goal deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
