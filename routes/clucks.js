const express = require('express');
const knex = require('../db/client');

const router = express.Router()

//------------------POST ROUTES---------------------------

//------------------------Index of all Posts: ---------------

// the below path automatically assumes that is has the '/clucks' prefixed to it
router.get('/', (req,res) => {
  knex('clucks')
  .orderBy('created_at', 'desc')
  .then(clucks => {
    res.render('clucks/index', {clucks: clucks})
  })
})

//------------ Render New Post Template----------------
router.get('/new', (req, res) => {
  res.render('clucks/new', { cluck: false });
})

//----------------Create new Post------------------------
router.post('/', (req, res) => {
  knex('clucks')
  .insert({
    username: req.cookies.username,
    image_url: req.body.image_url,
    content: req.body.content
  })
  .returning('*')
  .then(clucks => {
    const cluck = clucks[0]
    res.redirect(`clucks`)
  })
})

module.exports = router;