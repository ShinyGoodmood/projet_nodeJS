const express = require('express');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

const router = express.Router();
const secretKey = 'secret';

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Access denied');

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch {
    res.status(401).send('Invalid token');
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  next();
};

router.get('/test', (req, res) => res.send('hello'));

router.post('/login', async (req, res) => {
  const { email, pseudo } = req.body;
  const user = await User.findOne({ where: { email, pseudo } });
  if (!user) return res.status(401).send('Bad credential/incorect user');

  const token = jwt.sign({ id: user.id, role: user.role }, secretKey);
  res.send({ token });
});

router.post('/register', async (req, res) => {
  try {
    const { email, pseudo } = req.body;
    await User.create({ email, pseudo });
    res.send('OK');
  } catch {
    res.send('KO');
  }
});

router.get('/profil/:id', authenticate, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).send('User not found');
  res.send({ email: user.email, pseudo: user.pseudo });
});

router.delete('/users/rm/:id', authenticate, isAdmin, async (req, res) => {
  await User.destroy({ where: { id: req.params.id } });
  res.send('User deleted');
});

router.post('/users/ban/:id', authenticate, isAdmin, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).send('User not found');
  user.role = 'banned';
  await user.save();
  res.send('User banned');
});

router.get('/users/list', authenticate, isAdmin, async (req, res) => {
  const users = await User.findAll();
  res.send(users);
});

router.post('/user/up/:id', authenticate, isAdmin, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).send('User not found');
  user.role = 'admin';
  await user.save();
  res.send('User promoted');
});

router.post('/user/down/:id', authenticate, isAdmin, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).send('User not found');
  user.role = 'user';
  await user.save();
  res.send('User demoted');
});

module.exports = router;
