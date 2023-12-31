const express = require('express');
const mongoose = require('mongoose')

const router = express.Router();
const bcrypt = require('bcryptjs');


// User Model
const User = require('../Models/User');

//login page
router.get('/login', (req, res) => res.render("Login"))


//Register
router.get('/register', (req, res) => res.render("register"))


//register Handle
router.post('/register', (req,res) =>{
 const {name, email,password,password2} = req.body
 let errors =[]


 // check required fields
 if(!name || !email || !password || !password2){
    errors.push({msg: "Please fill in the required fields"})
    }

    //Check Password
    if (password !== password2) {
        errors.push({msg: "Passwords do not match"})
    }


    //Check pass length
    if(password.length < 6){
        errors.push({msg: "Password should be at least 6 characters"})
    }

    if (errors.length > 0 ){
        res.render("register",{
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
       // validation pass
        User.findOne({email: email})
        .then(user => {
            if(user) {
                //User exists

                errors.push({msg: "this email is already registered"})
                res.render("register",{
                    errors,
                    name,
                    email,
                    password,
                    password2
                })

            } else {
                const newUser = new User ({
                    name,
                    email,
                    password
                })
                //hash pasword
                bcrypt.genSalt(10,(err, salt) => 
                bcrypt.hash(newUser.password, salt, (err, hash)=>{

                        if(err) throw err;

                        // Set password to hashed
                        newUser.password = hash;
                    // Save user
                    newUser.save()
                    .then(user => {
                        req.flash("success_msg", "you are now registered and can log in")
                        res.redirect("/users/login")
                    })
                    .catch(err => console.log(err))

                }))

            }
        })
    }
});

module.exports = router