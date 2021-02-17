const express = require("express");
const bodyParser = require("body-parser");
const methodoverride = require("method-override");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(methodoverride("_method"));

mongoose.connect("mongodb://localhost:27017/memeDB", {useNewUrlParser: true ,useUnifiedTopology: true });

const postSchema = new mongoose.Schema(
    {
        name: String,
        caption: String,
        url: String,
    },
    {
        versionKey: false
    }
);

const Post = mongoose.model("Post", postSchema);

app.route("/")
    .get(function(req,res) {
        Post.find({}, function(err, posts) {

            if(err) {
                console.log(err);
            } else {
                res.render("home", {
                    posts: posts
                });
            }
        });
    })

    .post(function(req, res) {
        const post = new Post({
            name: req.body.name,
            caption: req.body.caption,
            url:req.body.url
        });

        post.save(function(err) {
            if (!err){
                res.redirect("/");
                c++;
            } else {
                console.log(err);
            }
        });
    });

app.route("/memes")
  .get(function(req, res) {
    Post.find(function(err, foundMemes) {
      if (err) {
        console.log(err);
      } else {
        res.send(foundMemes);
      }
    });
  })

  .post(function(req, res) {
    const article = new Post({
      _id: (c + 1).toString(),
      name: req.body.name,
      url: req.body.url,
      caption: req.body.caption
    });
    article.save(function(err) {
      if (!err) {
        console.log("Successfully added a new article");
        c++;
        res.send({_id: article._id});
      } else {
        console.log(err);
      }
    });
  })

app.route("/memes/:memeId")
    .get(function(req, res) {
      Post.findOne({_id: req.params.memeId}, function(err, foundMeme) {
        if(foundMeme) {
          res.send(foundMeme);
        } else {
            const error = {
                cod: "404",
                message: "meme id not found"
            };
          res.send(error);
        }
      });
    })

//EDIT Route

app.route("/memes/:id/edit")
    .get(function(req, res) {
        Post.findById(req.params.id, function(err, foundMeme) {
            if (err) {
                res.redirect("/");
            } else {
                res.render("edit", {meme: foundMeme});
            }
        });
    })

    .patch(function(req, res) {
      Post.updateOne(
        {_id: req.params.id},
        {$set: req.body},
        function(err) {
          if (!err) {
            res.redirect("/#" + req.params.id);
          } else {
            res.send(err);
          }
        }
      );
    })

app.listen(3000,function(){
  console.log("Server running on port 3000");
})
