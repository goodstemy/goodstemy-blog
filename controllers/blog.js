require('dotenv').config();

const express = require('express');
const Sequelize = require('sequelize');
const Post = require('../models/posts');
const Comment = require('../models/comments');
const Admin = require('../models/admins');
const router = express.Router();
const sequelize = new Sequelize(process.env.POSTGRES_URI);

router.get('/', async (req, res) => {
  const [posts, metadata] = await sequelize
    .query(`SELECT posts.*, (select count(*) from comments where posts.id = comments.post_id) as comments_count from posts order by posts.id;`)
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });

  res.render('main', {posts});
});

router.get('/like/:id', async (req, res) => {
  const {id} = req.params;

  if (!id) {
    return res.sendStatus(400);
  }

  await sequelize
    .query(`UPDATE posts SET likes = posts.likes + 1 WHERE posts.id = ${id};`)
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });

  res.sendStatus(200);
});

router.get('/post/create', (req, res) => {
  res.render('create_post');
});

router.post('/post/create', async (req, res) => {
  const {title, description, body} = req.body;

  if (!title || !body) {
    return res.sendStatus(400);
  }

  const author = body.split('___')[1],
        pass = body.split('___')[2];
  const admins = await Admin.findAll({
    where: {
      name: author
    }
  });

  if (admins[0].name !== author || admins[0].password !== pass) {
    return res.sendStatus(403);
  }

  await Post.create({
    title,
    description,
    body: body.split('___')[0],
    createdAt: +new Date()
  }).catch((error) => res.send(500, error));

  res.sendStatus(200);
});

router.get('/post/:id', async (req, res) => {
  const {id} = req.params;

  if (!id) {
    return res.sendStatus(400);
  }

  const [comments, posts] = await Promise.all([
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
    .catch((error) => res.send(500, error));

  res.render('post', {comments, post: posts[0]});
});

router.post('/comment/create', async (req, res) => {
  const {sender, text, postId} = req.body;

  if (!sender || !text || !postId) {
    return res.sendStatus(400);
  }

  const posts = await Post.findAll({
    where: {id: postId}
  }).catch((error) => res.send(500, error));

  await Comment.create({
    sender,
    text,
    post_id: postId
  }).catch((error) => res.send(500, error));

  if (!posts.length) {
    return res.send(400, `Post with ${id} not found`);
  }

  res.sendStatus(200);
});

module.exports = router;
