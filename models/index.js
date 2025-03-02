const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('projetexpress', 'root', '', { host: 'localhost', dialect: 'mysql' });

const User = sequelize.define('User', {
  pseudo: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'user' },
});

module.exports = { sequelize, User };