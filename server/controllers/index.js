let mongoose = require('mongoose');
let passport = require('passport');

// define the User Model
let userModel = require('../models/user');
let User = userModel.User; // alias


/* CONTROLLERS SECTION */
module.exports.displayHome = (req, res, next) =>
{

  res.render('index', 
    { 
      title: 'Home',
      displayName: req.user ? req.user.displayName : ""
    });
}

module.exports.displayAbout = (req, res, next) =>
{
  res.render('index',
  {
    title: 'About',
    displayName: req.user ? req.user.displayName : ""
  });
}

module.exports.displayContact = (req, res, next) =>
{
  res.render('index',
  {
    title: 'Contact',
    displayName: req.user ? req.user.displayName : ""
  });
}

module.exports.displayProducts = (req, res, next) =>
{
  res.render('index',
  {
    title: 'Products',
    displayName: req.user ? req.user.displayName : ""
  });
}

module.exports.displayServices = (req, res, next) =>
{
  res.render('index',
  {
    title: 'Services',
    displayName: req.user ? req.user.displayName : ""
  });
}

module.exports.displayLogin = (req, res, next) =>
{
  // check if user is already logged in
  if(!req.user) 
  {
    res.render('index',
    {
      title: 'Login',
      messages: req.flash("loginMessage"),
      displayName: req.user ? req.user.displayName : ""
    });
  }
  else
  {
    return res.redirect("/");
  }

}

module.exports.processLoginPage = (req, res, next) => 
{

  passport.authenticate('local', 
  (err, user, info) => {
    // server error
    if(err)
    {
      return next(err);
    }

    // is there a user login error?
    if(!user)
    {
      req.flash("loginMessage", "Authentication Error");
      console.log(err);
      return res.redirect('/login');
    }

    req.logIn(user, (err) => {
      // another type of server error
      if(err)
      {
        return next(err);
      }
      // all is good - login
      return res.redirect('/contact-list');
    });
  })(req, res, next);
}

module.exports.displayRegisterPage = (req, res, next) =>
{
  // check if user is already logged in
  if(!req.user) 
  {
    res.render('index',
    {
      title: 'Register',
      messages: req.flash("registerMessage"),
      displayName: req.user ? req.user.displayName : ""
    });
  }
  else
  {
    return res.redirect("/");
  }
}

module.exports.processRegisterPage = (req, res, next) => 
{
  // define a new user object
  let newUser = new User({
    username: req.body.username,
    //password: req.body.password
    email: req.body.email,
    displayName: req.body.displayName
  });

  User.register(newUser, req.body.password, (err) => {
    if(err)
    {
      console.log('Error: Inserting New User');
      if(err.name == "UserExistsError")
      {
        req.flash("registerMessage", "Registration Error: User Already Exists");
        console.log("Error: User Already Exists");
      }
      return res.render('index', 
      {
        title: 'Register',
        messages: req.flash("registerMessage"),
        displayName: req.user ? req.user.displayName : ""
      });
    }
    else
    {
      // if no error exists, then registration is successful

      // log the user in
      return passport.authenticate('local')(req, res, () =>{

        // then redirect user to the contact-list
        res.redirect('/contact-list');
      })
    }
  });
}

module.exports.performLogout = (req, res, next) => {
  req.logout();
  res.redirect("/");
}