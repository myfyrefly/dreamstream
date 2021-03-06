// Requiring path to so we can use relative routes to our HTML files
// var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/isAuthenticated");
var db = require("../models");

module.exports = function (app) {
  app.get("/", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/dreamstream-home");
    }
    res.render("signup", {
      user: req.user,
      style: "login.css"
    });
  });

  app.get("/login", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/dreamstream-home");
    }
    res.render("login", {
      user: req.user,
      style: "login.css"
    });
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/dreamstream-home", isAuthenticated, function (req, res) {
    var query = {};
    if (req.query.user_id) {
      query.UserId = req.query.user_id;
    }
    db.Post.findAll({
      where: query,
      include: [db.User]
    }).then(function (dbPost) {
      var data = dbPost.map(e =>
        e.dataValues
      );
      res.render("dreamstream-home", {
        post: data,
        user: req.user,
        style: "main.css"
      });
    });
  });

  app.get("/new-dream", isAuthenticated, function (req, res) {
    res.render("newDream", {
      user: req.user,
      style: "main.css"
    });
  });

  app.get("/dreams/:id", (req, res) => {
    db.Post.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Comment, db.User]
      // To call it in the handlebars it would be
      // for the comment: {{Comment.dataValues.commentary}}
    })
      .then(detail => {
        console.log(detail);
        res.render("user-dream", {
          post: detail
        });
      });
  });
};
