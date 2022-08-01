// signup////
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/UserModel');
const verifytokenAndAuthorization = require('../routes/verifytoken');


exports.getSignup = (req, res) => {

    res.render('signup');
}



exports.postSignup = async (req, res) => {
    try {
        const {
            fname,
            lname,
            email,
            city,
            gender,
            country,
            password
        } = req.body
        console.log(fname,
            lname,
            email,
            city,
            gender,
            country,
            password);
        const newUser = await new User(req.body);
        await newUser.save();
        res.redirect('/signin');
    } catch (error) {

    }
}



// sigin////////
exports.checkLog = (req, res, next) => {
    const authHeader = req.headers.cookie;
    if (authHeader) {
        const token = authHeader.split('=')[1];
        if (token) {
            jwt.verify(token, process.env.JWT_SECRTKEY, (err, client) => {
                if (err) {
                    next()
                } else {
                    res.redirect(`/users/${client.id}`);
                }
            })
        } else {
            next()
        }
    } else {
        next()
    }

}


exports.getSignin = (req, res) => {
    res.render('signin');
}



exports.postSignin = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;
        console.log(password);
        const user = await User.findOne({
            email
        });
        if(!user.isActive){
            res.json({
                status:"blocked",
                message:"sorry your account has been disabled"
            })
        }else{

            if (user) {
                bcrypt.compare(password, user.password).then(data => {
                    console.log(data);
                    if (data) {
                        const token = jwt.sign({
                            id: user._id,
                            isAdmin: user.isAdmin
                        }, process.env.JWT_SECRTKEY);
                        if (user.isAdmin) {
                            res.cookie('jwt', token, {
                                httpOnly: true
                            }).redirect(`/admin`);
                        } else {
                            res.cookie('jwt', token, {
                                httpOnly: true
                            }).redirect(`/users/${user._id}`);
                        }
                    } else {
                        res.json({
                            status: "failed",
                            data: {
                                message: "invaild email or password"
                            }
                        });
                        
                    }
                })
            } else {
                res.json({
                    status: "failed",
                    data: {
                        message: "invaild email or password"
                    }
                });
                
            }
            
        }
            
            
    } catch (err) {
        console.log(err);

    }

}

// logout////


exports.logout = (req, res) => {

    res.clearCookie('jwt').redirect('/signin');
}