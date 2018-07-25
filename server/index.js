const express = require('express');
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const axios = require('axios');
const bcrypt = require('bcrypt');
const session = require('express-session');
const mock = require('../specs/mockdata.json');
const db = require('../database/helpers.js');
const mdbKey = process.env.MDBKEY || require('../config.js').mdbKey;
const ytKey = process.env.YTKEY || require('../config.js').ytKey;
const nytKey = process.env.NYTKEY || require('../config.js').nytKey;

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: 'text/html' }));
app.use(session({
  secret: 'toy banjo',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 }
}));

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/../node_modules'));
// app.use('/signin', express.static(__dirname + '/../client/templates/signin.html'));
// app.use('/signup', express.static(__dirname + '/../client/templates/signup.html'));

app.get('/items/:category/:order', function(req, res) {
  // res.status(200).send(mock);
  console.log('req.session.user: ', req.session)
  let person = req.session.user || 'public'
  db.selectAll(person, req.params.category, req.params.order, (result) => res.status(200).send(result));
})

app.post('/items', function(req, res) {
axios.get(`https://api.themoviedb.org/3/search/movie?include_adult=false&page=1&query=${req.body.title}&language=en-US&api_key=${mdbKey}`)
  .then(response => {
    axios.get(`https://api.themoviedb.org/3/movie/${response.data.results[0].id}?language=en-US&api_key=${mdbKey}`)
    .then(response => {
      let movie = {
        title: req.body.title,
        year: response.data.release_date.split('-')[0],
        runtime: response.data.runtime,
        imdb: response.data.popularity.toFixed(1)
      }
      axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${req.body.title}+${movie.year}+trailer&type=video&videoEmbeddable=true&key=${ytKey}`)
      .then(response => {
        movie.video = response.data.items[0].id.videoId;
        axios.get(`https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=${movie.title}&api-key=${nytKey}`)
        .then(response => {
          movie.summary = entities.decode(response.data.results[0].summary_short).replace('\'', '\'\'');
          movie.link = response.data.results[0].link.url;
          movie.person = req.session.user || 'public';
          db.addMovie(movie, (result) => {
            console.log('result from db.addMovie: ', result)
            console.log('res inside db.addMovie: ', res.status)
            res.status(201).send(result)
          });
        })
      })
      .catch(error => {
        console.log(error);
      });
    })
    .catch(error => {
      console.log(error);
    });
  })
  .catch(error => {
    console.log(error);
  });
})

app.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      res.redirect(500, '/');
    }
    req.body.password = hash;
  });
  db.checkUserExists(req.body.username, (result) => {
    if(result.length) {
      res.status(500).send('username already exists!');
    } else {
      console.log('creating user')
      db.createUser(req.body, (result) => {
        req.session.regenerate(() => {
          console.log('regenerating')
          console.log('result: ', result)
          req.session.user = result;
          res.redirect('/');
        });
      });
    }
  });
});

app.post('/signin', (req, res) => {
  db.fetchUser(req.body.username, (result) => {
    console.log('result after fetchUser: ', result)
    if (!result.length) {
      res.status(500).send('username-password mismatch')
    } else {
      console.log('result[0].password: ', result[0].password)
      bcrypt.compare(req.body.password, result[0].password, (err, match) => {
        if (!match) {
          res.status(500).send('username-password mismatch');
        } else {
          req.session.regenerate(() => {
            req.session.user = result[0].id;
            res.status(200).end();
          });
        }
      })
    }
  });
});

app.get('/signout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.clearCookie('connect.sid');
        res.redirect('/');
      }
    });
  }
});

app.post('/rating', function(req, res) {
  console.log('req.body: ', req.body);
  db.changeRating(req.body.title, req.body.rating, (result) => res.status(201).send(result));
})

app.post('/remove', function(req, res) {
  console.log('req.body: ', req.body);
  db.remove(req.body.id, (result) => res.status(201).send(result));
})

app.listen(PORT, () => console.log(`listening on port ${PORT} . . .`));