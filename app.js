const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const { sequelize, User } = require('./models');

const app = express();
app.use(bodyParser.json());

app.use('/api', userRoutes);

const init = async () => {
  await sequelize.sync({ force: true });
  await User.create({ pseudo: 'lucas', email: 'lucas@mail.com', role: 'admin' });
  console.log('Database initialized');

  app.listen(3000, () => console.log('Server running on port 3000'));
};

init();