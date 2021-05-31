const express = require('express');
const router = new express.Router();
const _ = require('lodash');

const Task = require('../models/task');
const auth = require('../middlewares/authenticate');
const validation = require('./validation/task');

router.post('/', auth, validation.createEditTask(), async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, owner: req.user._id });
    const newTask = await Task.findById(task._id).populate('owner');
    res.status(201).send(newTask);
  } catch (e) {
    res.status(400).send(e.message);
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({}).populate('owner');
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.get('/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
})

router.put('/:id', validation.createEditTask(), auth, async (req, res) => {
  const allowedUpdates = _.pick(req.body, ['completed', 'description', 'title']);
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, allowedUpdates, { new: true }).populate('owner');
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
})

module.exports = router;