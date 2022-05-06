//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

mongoose.connect("mongodb+srv://kush-14:ZtBQ4QQcPDhyVNQC@cluster0.9nygn.mongodb.net/blogDb?retryWrites=true&w=majority", {
  useNewUrlParser: true
});

const postsSchema = new mongoose.Schema({
  title: String,
  text: String
});

const Post = mongoose.model("Post", postsSchema);
var postsLocal = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    postsLocal = posts;
    res.render("home", {
      homeStartingContent: homeStartingContent,
      posts: posts,
    });
  })
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {

  const post = new Post({
    title: req.body.composeTitle,
    text: req.body.composeText
  });

  post.save(function (err) {
    if (err) {
      console.log(err);
    } else res.redirect("/");
  });


});

app.get("/posts/:postName", function (req, res) {
  const postNameCurrent = _.lowerCase(req.params.postName);
  postsLocal.forEach(function (element) {
    const storedTitle = _.lowerCase(element.title);
    if (storedTitle === postNameCurrent) {
      res.render("post", {
        title: element.title,
        text: element.text,
      });
    } else {
      console.log("Not Match");
    }
  });
});

app.get("/delete/:postName", async function (req, res) {
  const postNameCurrent = _.lowerCase(req.params.postName);
  for (var i = 0; i < postsLocal.length; i++) {
    const storedTitle = _.lowerCase(postsLocal[i].title);
    if (storedTitle == postNameCurrent) {
      const query = {
        title: req.params.postName
      }
      const post = await Post.deleteOne(query);
      return res.redirect("/");
    }
  }
  console.log("Not Match")
  return res.redirect("/");
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});