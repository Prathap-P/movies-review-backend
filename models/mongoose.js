const mongoose = require('mongoose');

mongoose.connect((process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/movie_review_test') , { useUnifiedTopology: true, useNewUrlParser: true })
.then(db => console.log("Database connected"))
.catch(err => console.log(err))

const schema = mongoose.Schema;

const userSchema = new schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
    isAdmin : {
        type : Boolean,
        default : false
    }
})

const commentSchema = new schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    movie : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Movie'
    },
    commentText : {
        type : String,
        required : true
    }
})

const movieSchema = new schema({
    name : {
        type : String,
        required : true
    },
    rating:{
        type : Number,
        required : true
    },
    year : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Comment'
        }
    ]
})

const userModel = new mongoose.model('User', userSchema);
const commentModel = new mongoose.model('Comment', commentSchema);
const movieModel = new mongoose.model('Movie', movieSchema);

(async function(){
    const users = await userModel.find();
    const comments = await commentModel.find();
    const movies = await movieModel.find();

    // console.log(users);
    // console.log(comments);
    // console.log(movies);

    // const admin = await userModel.findOne({ email : "admin@admin.com" });
    // console.log(admin);
    // admin.isAdmin = true;
    // console.log(admin);
    // await admin.save();

})()

module.exports = {
    userModel,
    commentModel,
    movieModel
}