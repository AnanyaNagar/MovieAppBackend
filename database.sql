CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE movieapp;

CREATE TABLE userauth(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL
);

CREATE TABLE usermovies(
    movie_id SERIAL PRIMARY KEY,
    user_id uuid,
    movie_name TEXT NOT NULL,
    movie_rating INT NOT NULL,
    movie_cast TEXT [] NOT NULL,
    movie_genre TEXT NOT NULL,
    movie_date DATE NOT NULL,
    FOREIGN KEY(user_id) REFERENCES userauth (user_id)
);

INSERT INTO usermovies 
(user_id, movie_name, movie_rating, movie_cast, movie_genre, movie_date) 
VALUES('668478ec-a3c3-41fb-818e-d76af4fb49e2', 'Om Shaanti Om', 10, ARRAY ['Shahrukh Khan', 'Deepika'], 'Thriller', '2007-11-09');

UPDATE usermovies SET movie_name = 'Om Shaanti Om', movie_rating = 8, movie_cast = ARRAY ['Shahrukh Khan', 'Deepika'], movie_genre = 'Thriller', movie_date= '2007-11-09' WHERE movie_id = 2;
            