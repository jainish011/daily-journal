require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require('lodash');
const mongoose=require('mongoose')
const homeStartingContent = "Welcome to Daily Journal";
const aboutContent = "First let me introduce myself, So I am Jainish Chauhan currently pursuing my BTech CSE from Nirma University and While learning node js and mongodb i made this project. It's simple daily journal website which help you to write your daily activities.";

const uname=process.env.UNAME
const pswd=process.env.PWD
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://${uname}:${pswd}@cluster0.4tn56.mongodb.net/postDB`)

const postSchema=new mongoose.Schema({
  title:String,
  content:String
})

const Post=new mongoose.model("Post",postSchema)

app.get("/",function(req,res){
  Post.find(function(err,foundPostDetails){
    if(!err){
      if(foundPostDetails){
        res.render("home",{details:homeStartingContent,post:foundPostDetails})
      }
    }
  })
})

app.get("/about",function(req,res){
  res.render("about",{details:aboutContent})
})

app.get("/compose",function(req,res){
  res.render("compose")
})

app.get("/posts/:postName",function(req,res){
  let postName=lodash.lowerCase(req.params.postName)

  Post.find(function(err,foundPostDetails){
    if(!err){
      if(foundPostDetails){
        foundPostDetails.forEach(function(e){
          let currentTitle=lodash.lowerCase(e.title)
          if(postName===currentTitle){
            res.render("post",{title:e.title,content:e.content})
          }
        })
      }
    }
  })  
})

app.post("/compose",function(req,res){
  const post=new Post({
    title:req.body.title,
    content:req.body.postContent
  })
  post.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/")
    }
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
