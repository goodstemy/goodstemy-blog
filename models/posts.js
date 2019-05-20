const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = new Sequelize('postgres://ivan:@localhost:5432/postgres');

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

class Post extends Model {}

Post.init({
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ""
  },
  body: {
    type: Sequelize.STRING,
    allowNull: false
  },
  likes: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'posts',
  timestamps: false
});

module.exports = Post;
