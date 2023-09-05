const jwt = require("jsonwebtoken")


const middlewareController = {
    //verify
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if(token) {
            const accessToken = token.split(" ")[1]
            jwt.verify(accessToken, process.env.MY_SECRETKEY, (err, user)=> {
                if(err) {
                    return res.status(403).json("Token is not valid")
                }
                req.user = user;
                next();
            })
        } else {
            return res.status(401).json("You're not authenticated")
        }
    },

    verifyTokenAndAdmin: (req,res , next) => {
        middlewareController.verifyToken(req, res, ()=> {
            if(req.user.id == req.params.id || req.user.admin) {
                next()
            } else {
                return res.status(403).json("You're not allowed to delete other")
            }
        })
    }
}

module.exports = middlewareController