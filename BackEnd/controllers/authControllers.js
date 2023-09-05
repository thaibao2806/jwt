const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

let refreshTokens = []

const authController = {
    //register user
    registerUser: async(req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);

            //create new user
            const newUser = await new User({
                userName: req.body.userName,
                email: req.body.email,
                password: hash
            })

            //save to db
            const user = await newUser.save();
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)    
        }
    },

    //generate access token
    generateAccessToken: (user) => {
        return jwt.sign({
                    id: user.id,
                    admin: user.admin,
                }, process.env.MY_SECRETKEY,
                {expiresIn: "30s"})
    },
    generateRefreshToken: (user) => {
        return jwt.sign({
                    id: user.id,
                    admin: user.admin,
                }, process.env.MY_SECRETKEY_REFRESH,
                {expiresIn: "30d"})
    },

    //login
    loginUser : async(req, res) => {
        try {

            const user = await User.findOne({userName: req.body.userName})
            if(!user) {
               return res.status(404).json("Wrong username!") 
            }

            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            )

            if(!validPassword) {
                return res.status(404).json("Wrong password!") 
            }
            
            if(user && validPassword) {
                const acessToken = authController.generateAccessToken(user)
                const refreshToken = authController.generateRefreshToken(user)
                refreshTokens.push(refreshToken)
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure:false,
                    path:"/",
                    sameSite:"strict"})
                const  {password, ...others} = user._doc
                res.status(200).json({ ...others, acessToken});
            }
        } catch (error) {
            res.status(500).json(error)
        }
    },

    requestRefreshToken: async (req, res) => {
    // Lấy refreshToken từ người dùng
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json("You're not authenticated");
    }
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.MY_SECRETKEY_REFRESH, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).json("Internal server error");
        }

        // Tạo lại accessToken và refreshToken
        const newAccessToken = authController.generateAccessToken(user);
        const newRefreshToken = authController.generateRefreshToken(user);
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
        refreshTokens.push(newRefreshToken);

        // Cập nhật refreshToken trong cookie và gửi phản hồi
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
        });

        res.status(200).json({ accessToken: newAccessToken });
    });
},

    //logout
    userLogout: async(req, res) => {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken) 
        res.status(200).json("Logged out!!!")
    }
}

module.exports = authController