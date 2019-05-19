const express = require('express');
const Post = require('../models/posts');
const Comment = require('../models/comments');
const router = express.Router();

router.get('/', (req, res) => {
  return Post.findAll({
      order: ['id'],
    })
    .then((posts) => {
      res.render('main', {posts});
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500)
    });
});

router.get('/post/:id', (req, res) => {
  const {id} = req.params;

  return Promise.all([
      Comment.findAll({
        where: {
          postId: id
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
    .catch(() => res.sendStatus(500));
});

router.get('/like/:id', (req, res) => {
  const {id} = req.params;

  if (!id) return;

  return Post.findAll({
    where: {id}
  }).then((post) => {
    if (!post) {
      return;
    }

    return Post.update({ likes: post[0].likes + 1 }, {
      where: {
        id
      }
    }).then(console.log).catch(console.error);
  }).catch(console.error);
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
    .catch(() => res.sendStatus(500));
});

router.post('/comment/create', (req, res) => {
  const {sender, text, postId} = req.body;

  if (!sender || !text || !postId) {
    return res.sendStatus(400);
  }

  return Post.findAll({
    where: {id: postId}
  }).then((posts) => {
    if (!posts.length) {
      return;
    }

    return Post.update({ commentsCount: posts[0].commentsCount + 1 }, {
      where: {
        id: postId
      }
    });
  }).then(() => {
    return Comment.create({
      sender,
      text,
      postId
    }).then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  });
});

module.exports = router;
