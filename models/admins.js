require('dotenv').config();

const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = new Sequelize(process.env.POSTGRES_URI);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

class Admin extends Model {}

Admin.init({
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'admins',
  timestamps: false
});

module.exports = Admin;
