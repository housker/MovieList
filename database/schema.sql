CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(200) NOT NULL,
  password      CHAR(60) NOT NULL
);

CREATE TABLE movies (
  id            SERIAL PRIMARY KEY,
  person        VARCHAR(50),
  title         VARCHAR(100),
  watched       BOOLEAN,
  rating        SMALLINT,
  year          SMALLINT,
  runtime       SMALLINT,
  imdb          SMALLINT,
  video         VARCHAR(100),
  summary       VARCHAR(500),
  link          VARCHAR(500)
);






