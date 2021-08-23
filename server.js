const express = require('express');
const app = express();

app.use(express.static(__dirname));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
/* serves main page */
app.get('/', (req, res) => {
  res.sendFile('test.html');
});

/** To redirect after auth login */
app.get('/auth/callback', (req, res) => {
  const code = req.query.code;

  res.redirect(`https://apps.inindca.com/genesys-bootstrap/test.html?code=${code}`);
  //res.redirect(`http://www.rsai.com:9998/test.html?code=${code}`);
});

/* serves all the static files */
app.get(/^(.+)$/, (req, res) => {
    console.log(`static file request: ${req.url}`);
  
    res.sendFile(__dirname + req.url);
  });

const port = process.env.PORT || 9998;

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
