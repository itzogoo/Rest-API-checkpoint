require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
const port = process.env.PORT || 3090;

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Error retrieving users' });
  }
});

app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const user = await newUser.save();
    res.json(user);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Error adding user' });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = req.body;
    const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndRemove(userId);
    res.json(user);
  } catch (error) {
    console.error('Error removing user:', error);
    res.status(500).json({ error: 'Error removing user' });
  }
});

