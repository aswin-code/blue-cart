const jwt = require('jsonwebtoken');

const verifytoken = (req, res, next) => {

    const authHeader = req.headers.cookie;
    if (authHeader) {
        const token = authHeader.split('=')[1];
        if (token) {
            jwt.verify(token, process.env.JWT_SECRTKEY, (err, client) => {
                if (err) {
                    res.redirect('/signin');
                } else {

                    req.user = client;
                    next();
                }
            })
        } else {
            res.redirect('/signin');
        }
    } else {
        res.redirect('/signin');
    }

}

const verifytokenAndAuthorization = (req, res, next) => {
    verifytoken(req, res, () => {

        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(500).json({
                message: 'access denied'
            })
        }
    })
}

module.exports = verifytokenAndAuthorization