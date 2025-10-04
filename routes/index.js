var express = require('express');
var router = express.Router();
const userModel = require("./users");
const passport = require('passport');
const localStrategy = require("passport-local")
const upload = require("./multer")
const postModel = require("./post")

passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { nav: false });
});
router.get('/register', function (req, res, next) {//// this is get register rout due to which the page shows now the the user fill and sumbit the form it will go to /register but that is post rout which sends the data to the server
  res.render('register', { nav: false });
});
router.get('/feed', isloogedin,async function (req, res, next) {
  const user=await userModel.findOne({ username: req.session.passport.user })
  const allposts =await postModel.find()
  .populate("user")
  res.render('feed', { user,allposts,nav: true });
});
router.get('/profile', isloogedin, async function (req, res, next) {//// this is get register rout due to which the page shows now the the user fill and sumbit the form it will go to /register but that is post rout which sends the data to the server
  const user =
    await userModel
      .findOne({ username: req.session.passport.user })
      .populate("posts")
  res.render('profile', { user, nav: true });
});
router.get('/show/posts', isloogedin, async function (req, res, next) {//// this is get register rout due to which the page shows now the the user fill and sumbit the form it will go to /register but that is post rout which sends the data to the server
  const user =
    await userModel
      .findOne({ username: req.session.passport.user })
      .populate("posts")
  res.render('show', { user, nav: true });
});
router.get('/add', isloogedin, async function (req, res, next) {//// this is get register rout due to which the page shows now the the user fill and sumbit the form it will go to /register but that is post rout which sends the data to the server
  const user = await userModel.findOne({ username: req.session.passport.user })
  res.render('add', { user, nav: true });

});
router.post('/createpost',  isloogedin, upload.single("postimage"), async function (req, res, next) {//// this is get register rout due to which the page shows now the the user fill and sumbit the form it will go to /register but that is post rout which sends the data to the server
  const user = await userModel.findOne({ username: req.session.passport.user })
  const userposts = await postModel.create({
    user: user._id,       // here the first user is the postModel user and the second user is the loogedin user
    title: req.body.title,
    Description: req.body.Description,
    image: req.file.filename

  })
  user.posts.push(userposts._id)
  await user.save()
  res.redirect("/profile")
});

router.post('/fileupload', isloogedin, upload.single("image"), async function (req, res, next) {//here up.single("image") the name image is come from the form made in tghe profile .ejs file
  const user = await userModel.findOne({ username: req.session.passport.user })
  user.profileImage = req.file.filename;
  await user.save()
  res.redirect("/profile")
});


router.post('/register', function (req, res, next) {//// this is get register rout due to which the page shows now the the user fill and sumbit the form it will go to /register but that is post rout which sends the data to the server
  const data = new userModel({
    username: req.body.username,// here you can see first field is telling about the data and the second field will recive the data that will come from the website
    // password:req.body.password,// remember the first password should match from the users.js file and then the second password should match from register.ejs name field
    email: req.body.email,// remember the first password should match from the users.js file and then the second password should match from register.ejs name field
    contact: req.body.contact,// remember the first password should match from the users.js file and then the second password should match from register.ejs name field
    name:req.body.fullname,
  })
  userModel.register(data, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      })
    })

});


router.post('/login', passport.authenticate("local", {
  failureRedirect: "/",
  successRedirect: "/profile",

}), function (req, res, next) {//// this is get register rout due to which the page shows now the the user fill and sumbit the form it will go to /register but that is post rout which sends the data to the server

});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isloogedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/")


}

module.exports = router;
