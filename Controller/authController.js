// signup////
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/users/UserModel');
const verifytokenAndAuthorization = require('../routes/verifytoken');


exports.getSignup = (req, res) => {

    res.render('signup', { layout: 'signinSignupLayout' });
}



exports.postSignup = async (req, res) => {
    try {
        const oldUser = await User.findOne({ email: req.body.email })
        if (oldUser) return res.json({ status: "failed" });
        const newUser = await new User(req.body);
        await newUser.save();
        const token = jwt.sign({
            id: newUser._id,
            isAdmin: newUser.isAdmin
        }, process.env.JWT_SECRTKEY);
        res.cookie('jwt', token, { httpOnly: true, expires: new Date(Date.now() + 10 * 1000) }).json({ url: `/users/${newUser._id}` })

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
    res.render('signin', { layout: 'signinSignupLayout' });
}



exports.postSignin = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({
            email
        });
        if (!user.isActive) {
            res.json({
                status: "blocked",
                message: "sorry your account has been disabled"
            })
        } else {

            if (user) {
                bcrypt.compare(password, user.password).then(data => {

                    if (data) {
                        const token = jwt.sign({
                            id: user._id,
                            isAdmin: user.isAdmin
                        }, process.env.JWT_SECRTKEY);
                        if (user.isAdmin) {
                            res.cookie('jwt', token, {
                                expires: new Date(Date.now() + 10 * 100000),
                                httpOnly: true
                            }).json({ url: `/admin/home` });
                        } else {
                            res.cookie('jwt', token, {
                                expires: new Date(Date.now() + 10 * 100000),
                                httpOnly: true
                            }).json({ url: `/users/${user._id}` });
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


    }

}

// logout////


exports.logout = (req, res) => {

    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    }).redirect('/signin');
}