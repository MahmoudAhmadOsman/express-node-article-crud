var express = require("express");
const Article = require("../models/article");

var router = express.Router();

/* @ GET home page. Find All data*/

router.get("/", function (req, res) {
  Article.find({}, function (error, articles) {
    if (error) {
      console.log("No DATA in the database!");
      console.log(error);
    } else {
      res.render("index", {
        title: "Latest Health News",
        article: articles,
      });
    }
  }).sort({ publishedDate: "desc" });
});

//Post data to the database
router.post("/uploads", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "OOOOOPS, No file uploaded!",
      });
    } else {
      var data = req.body;
      let avatar = req.files.avatar;

      avatar.mv("./public/images/uploads/" + avatar.name);

      //send response for testing
      // res.send({
      //   status: true,
      //   message: "File has been uploaded successfully!",
      //   data: {
      //     avatar: avatar.avatar,
      //     mimetype: avatar.mimetype,
      //     size: avatar.size,
      //   },
      // });

      //Insert into database
      Article.create(
        {
          title: data.title,
          message: data.message,
          author: data.author,
          tag: data.tag,
          avatar: avatar.name,
        },
        function (error, data) {
          if (error) {
            console.log(
              "There was a problem adding this image to the database"
            );
          } else {
            console.log("Image added to database");
            console.log(data);
            //res.redirect("/");
          }
        }
      );
      res.redirect("/");
      //////////////////////
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//Show the data on the homepage

router.get("/:id/show", function (req, res) {
  Article.findById(req.params.id, function (err, article) {
    if (err) {
      res.redirect("/");
      console.log(err);
    } else {
      res.render("show", {
        title: "Details of ",

        article: article,
      });
    }
  });
});

//Delete
router.delete("/:id", async (req, res) => {
  res.send("delete");
  return;
  let article;
  try {
    article = await Article.findById(req.params.id);
    await article.remove();
    res.redirect(`/`);
  } catch {
    if (article == null) {
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  }
});
module.exports = router;
