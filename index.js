const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const models = require('./models/mongoose.js');
const {authRouter, isAdmin, isAuthenticated} = require('./auth.js');

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended : false }));

//Returns all movies(Public)
app.get('/', async(req, res) => {
    try{
        // Get all movies from DB
        const allMovies = await models.movieModel.find().populate('comments');
        movies_list = [];

        for(let movie of allMovies)
            movies_list.push(movie);

        // Send movies through json
        res.json({
            success : 'true',
            movies_list
        });
        
    }
    catch(e){
        res.json({
            success : 'false',
            error : e.message
        })
    }
})

//Get details of a single movie with its id(public)
app.get('/movie/:id', async(req, res) => {
    try{
        // Get the specific movie from DB
        const movie = await models.movieModel.find({ _id : mongoose.Types.ObjectId(req.params.id) }).populate('comments');

        res.json({
            success : 'true',
            movie
        });
    }
    catch(e){
        res.json({
            success : 'false',
            error : e.message
        })
    }
})

//Update the details of a movie(Admin)
app.put('/movie/:id', isAuthenticated, isAdmin, async(req, res) => {
    try{
        const movie = await models.movieModel.findById(req.params.id);
        //Rewrite with new details
        movie.name = req.body.name;
        movie.year = req.body.year;
        movie.description = req.body.description;

        //Save the changes to DB
        await movie.save();

        res.json({ 
            success : 'true',
            movie : await movie.populate('comments')
        });
    }
    catch(e){
        console.log(e);
        res.json({
            success : 'false',
            error : e.message
        })
    }
})

//Delete a specific movie(Admin)
app.delete('/movie/:id', isAuthenticated, isAdmin, async(req, res) => {
    try{
        await models.movieModel.deleteOne({ _id : req.params.id });

        res.json({ 
            success : 'true'
        });
    }
    catch(e){
        console.log(e);
        res.json({
            success : 'false',
            error : e.message
        })
    }
})

//Post a comment(User)
app.post('/movie/:id/add_comment', isAuthenticated, async(req, res) => {
    try{
        const movieId = req.params.id;
        
        //Create a comment instance of the model
        const comment = await models.commentModel({
            user : res.locals.userId,
            movie : movieId,
            commentText : req.body.commentText
        })
        //Save it to DB
        console.log(comment._id)
        await comment.save();
        
        //Add the comments to the movie
        const movie = await models.movieModel.findById(movieId);
        movie.comments.push(comment);
        await movie.save();

        res.json({
            success : 'true',
            movie : await movie.populate('comments')
        })
    }
    catch(e){
        res.json({
            success : 'false',
            error : e.message
        });
    }
})

//Delete a comment(User)
app.delete('/movie/:movieId/:commentId', isAuthenticated, async(req, res) => {
    try{
        const { movieId, commentId } = req.params;
        
        //Get the comment instance from DB
        const comment = await models.commentModel.findById(commentId);

        //Check whether the current user is the owner
        if(comment.user != res.locals.userId)
            throw new Error('User not authorized');

        //Delete from DB
        await models.commentModel.deleteOne({ _id : commentId });
        
        //Delete also from the comments list from the movie
        const movie = await models.movieModel.findById(movieId);
        movie.comments = movie.comments.filter(comment => comment != commentId)
        await movie.save();

        res.json({
            success : 'true',
            movie : await movie.populate('comments')
        })
    }
    catch(e){
        res.json({
            success : 'false',
            error : e.message
        });
    }
})

//Update a comment(User)
app.put('/movie/:movieId/:commentId', isAuthenticated, async(req, res) => {
    try{
        const { movieId, commentId } = req.params;
        //Get the updated comment
        const updatedComment = req.body['commentText'];

        //Get the comment from DB
        const comment = await models.commentModel.findById(commentId);
        
        //Check whether the current user is the owner
        if(comment.user != res.locals.userId)
            throw new Error('User not authorized');

        //Update the comment and save changes
        comment.commentText = updatedComment;
        await comment.save();
        
        const movie = await models.movieModel.findById(movieId);

        res.json({
            success : 'true',
            movie : await movie.populate('comments')
        })
    }
    catch(e){
        res.json({
            success : 'false',
            error : e.message
        });
    }
})

app.post('/add_movie', isAuthenticated, isAdmin, async(req, res) => {
    try{
        const movie_name= req.body.name, movie_year = req.body.year, movie_desc = req.body.description;
        const newMovie = await new models.movieModel({
            name : movie_name,
            year : movie_year,
            description : movie_desc
        })

        await newMovie.save();

        res.json({ success : 'true' });
    }
    catch(e){
        console.log(e);
        res.json({
            success : 'false',
            error : e.message
        })
    }
})

app.get('/logout', (req, res) => {
    res.clearCookie('jwt_token');
    res.send({
        success : 'true'
    });
})

app.use('/auth', authRouter);

app.listen((process.env.PORT || 9000), () => console.log('App running in port 9000'));