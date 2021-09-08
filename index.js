const express = require('express');
const app = express();

const path = require("path");
const logger = require("morgan");
const cors = require("cors");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

/** To redirect after auth login */
app.get('/auth/callback', (req, res) => {
  const code = req.query.code;

  res.redirect(`https://genesysjs.vercel.app/test.html?code=${code}`)
});

/* serves main page */
//app.use(express.static(path.join(__dirname, "build")));

app.get("*", function (_, res) {
    res.sendFile(
      path.join(__dirname, "test.html"),
      function (err) {
        if (err) {
          res.status(500).send(err);
        }
      }
    );
  });

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

module.exports = app;
