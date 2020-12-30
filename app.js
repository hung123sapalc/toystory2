const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { result } = require('lodash');
const { request } = require('express');
const methodOverride = require('method-override');
const toyRoutes = require('./routes/toyRoutes')
const userRoutes = require('./routes/userRoutes'); 
const expressLayouts = require('express-ejs-layouts')
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')
const { ensureAuthenticated } = require('./config/auth')
//Passport config:
require('./config/passport')(passport);

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://hungsapa123lc:sapa123lc@nodetuts.6dhzj.mongodb.net/node-tuts?retryWrites=true&w=majority";
const port = process.env.PORT || 3000;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(port, () => console.log(`Listening on ${port}...`)))
  .catch(err => console.log(err));
 
// EJS  app

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));


// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// Express Session:
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//Passport middleware:
app.use(passport.initialize());
app.use(passport.session());

// Connect flash:
app.use(flash());


// Global Vars:
app.use((req,res,next) =>{
   res.locals.success_msg = req.flash('succes_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   next();
})

// routes
app.get('/', (req, res) => {
  res.redirect('/toys');
});


//Toys route:
app.use('/toys', toyRoutes)
//Users route:
app.use('/users', userRoutes)



// 404 page
app.use(ensureAuthenticated, (req, res) => {
  res.status(404).render('404', { title: '404' });
});



