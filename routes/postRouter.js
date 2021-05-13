const express = require('express')
const postRouter = express.Router()
const multer=require('multer')
const {create,getAll,editPost,updatePost,deletePost} = require('../controllers/post.controller')
const authGuard=require('./guards/auth.guard')
const Post=require('../models/PostModel')


postRouter.get('/new',authGuard.isAuth, async (req, res, next) => {
  try {
    const Allposts = await Post.find({}).populate('author')
    res.render('createPost',{
      posts:Allposts,
      isLogged:req.session.userId
    })
  } catch (e) {
    next(e);
  }
});

postRouter.get('/edit/:id',editPost);

postRouter.delete('/:id',deletePost);

postRouter.put('/:id',multer({
  storage:multer.diskStorage({
    destination:(req,file,func)=>{
      func(null,'images')
    },
    filename:(req,file,func)=>{
      func(null,Date.now() + '-' + file.originalname)
    }
  })
}).single('photo'),updatePost);


postRouter.post('/store',
// check('title')
// .not()
// .isEmpty().withMessage('Title is required'),    
// check('content').not().isEmpty().withMessage('Content is Required'),
multer({
  storage:multer.diskStorage({
    destination:(req,file,func)=>{
      func(null,'images')
    },
    filename:(req,file,func)=>{
      func(null,Date.now() + '-' + file.originalname)
    }
  })
}).single('photo'),create);

postRouter.get('/', getAll);


module.exports = postRouter