import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../middleware/authorization.js';

const router = express.Router();


// get all movies
router.get('/movies/:user_id', authenticateToken, async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const movies = await pool.query("SELECT * FROM usermovies WHERE user_id = $1", [user_id]);
        res.json({movies: movies.rows});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

// add new movies
router.post('/movies/:user_id', authenticateToken, async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const {movie_name, movie_rating, movie_cast, movie_genre, movie_date} = req.body;
        const newMovie = await pool.query(
            "INSERT INTO usermovies (user_id, movie_name, movie_rating, movie_cast, movie_genre, movie_date) VALUES($1, $2, $3, $4, $5, $6) RETURNING *", 
            [user_id, movie_name, movie_rating, movie_cast, movie_genre, movie_date]
            );
        res.json({movies: newMovie.rows[0]});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

// edit existing movies
router.put('/movies/:movie_id', authenticateToken, async (req, res) => {
    try {
        const movie_id = req.params.movie_id;
        const {movie_name, movie_rating, movie_cast, movie_genre, movie_date} = req.body;
        const updatedMovie = await pool.query(
            "UPDATE usermovies SET movie_name = $1, movie_rating = $2, movie_cast = $3, movie_genre = $4, movie_date= $5 WHERE movie_id = $6", 
            [movie_name, movie_rating, movie_cast, movie_genre, movie_date, movie_id]
            );

        res.json({movies: updatedMovie.rows[0]});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// delete movies
router.delete('/movies/:movie_id', authenticateToken, async (req, res) => {
    try {
        const movie_id = req.params.movie_id;
        const deletedMovie = await pool.query("DELETE FROM usermovies WHERE movie_id = $1", [movie_id]);
        console.log("Here");
        res.json({status: "deleted successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


export default router;