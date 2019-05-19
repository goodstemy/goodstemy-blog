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

class Comment extends Model {}

Comment.init({
  postId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  sender: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  text: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'comments',
  timestamps: false
});

module.exports = Comment;
