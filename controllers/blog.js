const express = require('express');
const Sequelize = require('sequelize');
const Post = require('../models/posts');
const Comment = require('../models/comments');
const router = express.Router();
const sequelize = new Sequelize('postgres://ivan:@localhost:5432/postgres');

router.get('/', (req, res) => {
  sequelize.query(`SELECT posts.*, (select count(*) from comments where posts.id = comments.post_id) as comments_count from posts order by posts.id;`)
    .then(([posts, metadata]) => {
      res.render('main', {posts});
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500)
    });
});

router.get('/post/:id', (req, res) => {
  const {id} = req.params;

  Promise.all([
      Comment.findAll({
        where: {
          post_id: id
        }
      }),
      Post.findAll({
        where: {
          id
        }
      })
    ])
    .then(([comments, posts]) => {
      res.render('post', {comments, post: posts[0]});
    })
    .catch((error) => res.send(500, error));
});

router.get('/like/:id', (req, res) => {
  const {id} = req.params;

  if (!id) {
    return res.sendStatus(400);
  }

  Post.findAll({
    where: {id}
  }).then((posts) => {
    if (!posts.length) {
      return res.sendStatus(400);
    }

    res.sendStatus(200);

    return Post.update({ likes: posts[0].likes + 1 }, {
      where: {
        id
      }
    });
  }).catch((error) => res.send(500, error));
});

router.post('/post/create', (req, res) => {
  const {title, description, body} = req.body;

  if (!title || !body) {
    return res.sendStatus(400);
  }

  return Post.create({
    title,
    description,
    body,
    createdAt: +new Date()
  }).then(() => res.sendStatus(200))
    .catch((error) => res.send(500, error));
});

router.post('/comment/create', (req, res) => {
  const {sender, text, postId} = req.body;

  if (!sender || !text || !postId) {
    return res.sendStatus(400);
  }

  Post.findAll({
    where: {id: postId}
  }).then((posts) => {
    if (!posts.length) {
      return;
    }

    res.send(200);

    return Comment.create({
      sender,
      text,
      post_id: postId
    });
  }).catch((error) => res.send(500, error));
});

module.exports = router;
