const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const bcrypt = require('bcrypt')
router.post('/signup', async (req, res) => {

    User.find({ email: req.body.email })
        .then(user => {
            // the user wont checks in the databse it gives every time as user already exits by default it is null
            if (user.length == 1) {
                return res.status(200).json({
                    message: "mail already exists"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    else {
                        const user = new User({

                            email: req.body.email,
                            password: hash

                        })
                        user.save().then(result => {
                            console.log(result)
                            res.status(201).json({
                                message: "User created"
                            })
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                })
            }
        })


})


const jwt =  require('jsonwebtoken')
router.post('/login', async (req, res) => {
User.find({ email: req.body.email })
    .then(user => {
        // the user wont checks in the databse it gives every time as user already exits by default it is null
        if (user.length < 1) {
            return res.status(200).json({
                message: "Email is wrong"
            })
        } else {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: "Password is not matched"
                    })
                }
                if(result) {
       const token = jwt.sign({
                        email:user[0].email,
                    },
                   'my_secret_key',
                    {
                expiresIn : "1h"
                    }
                 );
                    return res.status(200).json({
                        message: "Auth Successfull",
                        token: token
                    })
                }
                res.status(500).json({
                    message: "Auth failed"
                })
            })
        }
    })

})

router.delete("/:userId", (req, res, next) => {
    User.remove({ _id: req.params.userId })

        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
module.exports = router