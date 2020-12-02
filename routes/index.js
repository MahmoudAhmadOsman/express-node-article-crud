const { render } = require("ejs");
var express = require("express");

const Article = require("../models/article");

var router = express.Router();

/* @ GET home page. Find All data*/

router.get("/", function (req, res) {
  Article.find({}, function (error, articles) {
    if (error) {
      res.redirect("/");
      //console.log(error);
    } else {
      res.render("index", {
        title: "Latest Health News",
        article: articles,
        expressFlash: req.flash("success"),
        sessionFlash: res.locals.sessionFlash,
      });
    }
  }).sort({ publishedDate: "desc" });
});

//Post data to the database -- ERROR
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
          author: data.author,
          avatar: avatar.name,
          message: data.message,
          tag: data.tag,
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
            //12/3/20
            //expressFlash: req.flash("success"),
            //sessionFlash: res.locals.sessionFlash,
          }
        }
      );
      req.flash("success", "Successfully saved!.");
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
        title: "",
        article: article,
      });
    }
  });
});

//Edit page
router.get("/:id/edit", function (req, res) {
  Article.findById(req.params.id, function (err, article) {
    res.render("edit", {
      title: "Edit Article",
      article: article,
    });
  });
});

//Update page

router.put("/:id", async (req, res) => {
  let article;
  try {
    article = await Article.findById(req.params.id);
    (article.title = req.body.title),
      (article.author = req.body.author),
      (article.avatar = req.body.avatar);
    (article.message = req.body.message),
      (article.tag = req.body.tag),
      await article.save();

    res.redirect(`/`);
  } catch {
    if (article == null) {
      res.redirect("/");
    } else {
      res.render("/", {
        article: article,
        // errorMessage: "Error occured while updating",
      });
    }
  }
});

//Delete Books

router.delete("/:id", async (req, res) => {
  // res.send("Delete route");
  // return;
  let article;
  try {
    article = await article.findByIdAndRemove(req.params.id);
    await article.remove();

    req.flash("success", "Successfully deleted!.");
    res.redirect(`/`);
  } catch {
    if (article == null) {
      res.redirect("/");
    } else {
      //res.redirect("/");
      res.send({
        status: false,
        message: "Unable to delete!",
      });
    }
  }
});

//About page
router.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
  });
});

//Services
router.get("/service", (req, res) => {
  res.render("service", {
    title: "Service",
  });
});
//Contact us route
router.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact Us",
  });
});

// Login route

router.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

module.exports = router;
