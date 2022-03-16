const express = require('express');
const authRouter = express.Router();
const models = require('./models/mongoose.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Checking whether the user is authenticated
let isAuthenticated = async(req, res, next) => {
    try{
        console.log(req.cookies);
        const token = req.cookies['jwt_token'];
        console.log(`Token ${token}`);

        if(!token)
            throw new Error('Not Authenticated');

        const payload = await jwt.verify(token, process.env.SECRET);
        res.locals.userId = payload.id;

        console.log('Authenticated')
        next();
    }
    catch(e){
        console.log(e);
        res.json({
            success : 'false',
            error : e.message
        })
    }
}

//Checking whether the user is admin
let isAdmin = async(req, res, next) => {
    try{
        const adminInfo = await models.userModel.findOne({ _id : res.locals.userId });

        if(!adminInfo.isAdmin)
            throw new Error('Not an Admin');

        next()
    }
    catch(e){
        console.log(e);
        res.json({
            success : 'false',
            error : e.message
        })
    }
}

authRouter.post('/register', async (req, res) => {
    try{        
        //Hashing the password
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        console.log('Password hashed...');

        //Instantiating the new user
        const newUser = await new models.userModel({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword
        })
        //Saving the user to db
        console.log('Object instan...');
        await newUser.save();

        console.log(newUser);
        
        res.json({ success : 'true' });
    }
    catch(e){
        console.log(e);
        res.json({ success : 'false' });
    }
})

authRouter.post('/login', async (req, res) => {
    console.log('In login')
    try{
        const email = req.body.email, password = req.body.password;

        //Checking whether the user is registered
        let registeredUser = null;
        if(! (registeredUser = await models.userModel.findOne({ email })) )
            throw new Error('User not registered');
        console.log('User registered');

        //Checking whether the password is correct
        const passwordMatched = await bcrypt.compare(password, registeredUser.password);
        if(!passwordMatched)
            throw new Error('Wrong password');
        console.log('Password Matched');
        
        //Creating the jwt token
        const jwtToken = jwt.sign({ id : registeredUser.id }, process.env.SECRET);
        res.cookie('jwt_token', jwtToken, {
            httpOnly : true
            // maxAge : 86400000
        })
        console.log('Cookie Set');
        console.log(registeredUser);

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

module.exports = {
    authRouter,
    isAdmin,
    isAuthenticated
}