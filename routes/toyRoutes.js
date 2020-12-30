const express = require('express');
const Toy = require('../models/toy');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth')


router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('create',  { title: 'Create a new toy' });
  });
 
  
router.get('/', ensureAuthenticated, (req, res) => {
    Toy.find().sort({ createdAt: -1 })
      .then(result => {
        res.render('index', { toys: result, title: 'All toys' });
      })
      .catch(err => {
        console.log(err);
      });
  });

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard',  { name : req.user.name , title: "Dasboard"});
  });  
  
  //Function
  router.post('/', (req, res) => {
    const toy = new Toy(req.body);
    toy.save()
      .then(result => {
        res.redirect('/toys');
      })
      .catch(err => {
        console.log(err);
      });
  });
  
  router.get('/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    Toy.findById(id)
      .then(result => {
        res.render('details', { toy: result, title: 'Toy Details' });
      })
      .catch(err => {
        console.log(err);
      });
  });
  // Update Function:
  
  router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Toy.findById(req.params.id, function (err, toy) {
      res.render('edit', {
        title : 'Edit Toys',
        toy:toy
      });    
    });
  });
  
  
  router.post('/edit/:id', (req,res,next) => {
    Toy.findByIdAndUpdate({_id: req.params.id}, req.body, (err, docs) =>{
      if(err){
        console.log("somthing went wrong");
        next(err)
      }
      else{
        res.redirect(`/toys/${req.params.id}`);
      }
    })
  })
  
  // Delete function
  router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Toy.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/toys' });
      })
      .catch(err => {
        console.log(err);
      });
  });

  module.exports = router;