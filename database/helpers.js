const { Client } = require('pg');
var fs = require('fs');
const client = new Client({
  connectionString: process.env.DATABASE_URL || require('../config.js').connectionString,
  ssl: true,
});
client.connect();

exports.addMovie = function(movie, cb) {
  console.log('movie in helper: ', movie)
  client.query(`INSERT INTO movies (person, title, watched, rating, year, runtime, imdb, video, summary, link) VALUES ('${movie.person}', '${movie.title}', false, 0, ${movie.year}, ${movie.runtime}, ${movie.imdb}, '${movie.video}', '${movie.summary}', '${movie.link}') RETURNING *`, (err, res) => {
    if (err) throw err;
    cb(JSON.stringify(res.rows[0]));
  });
}

exports.changeRating = function(title, rating, cb) {
  console.log('arguments in changeRating: ', arguments)
  client.query(`UPDATE movies SET watched = true, rating = ${rating} WHERE title = '${title}' RETURNING *`, (err, res) => {
    if (err) throw err;
    cb(JSON.stringify(res.rows));
  });
}

exports.selectAll = function(person, category, order, cb) {
  console.log('person: ', person)
  console.log('category: ', category)
  console.log('order: ', order)
  client.query(`SELECT * FROM movies WHERE person = '${person}' ORDER BY ${category} ${order}`, (err, res) => {
    if (err) throw err;
    cb(JSON.stringify(res.rows));
  });
}

exports.remove = function(id, cb) {
  client.query(`DELETE FROM movies where id = ${id}`, (err, res) => {
    if (err) throw err;
    cb(res);
  });
}

exports.checkUserExists = (username, cb) => {
  client.query('SELECT id FROM users WHERE username = $1', [username], (err, res) => {
    if (err) {
      console.log('error checking db')
      console.log(err.stack)
    } else {
      cb(res.rows)
    }
  });
};

exports.createUser = (user, cb) => {
  client.query(`INSERT INTO users (username, password) VALUES ('${user.username}', '${user.password}') RETURNING *`, (err, res) => {
    console.log('res inside createUser: ', res.rows[0].id)
      cb(res.rows[0].id);
  });
};

exports.fetchUser = (username, cb) => {
  client.query('SELECT * FROM users WHERE username = $1', [username], (err, res) => {
    if (err) {
      console.log('error checking db')
      console.log(err.stack)
    } else {
      cb(res.rows)
    }
  });
};


