const express = require('express');
const User = require('../models/user');
const cloudinary = require('../middlewares/cloudinary');
const extractFile = require('../middlewares/file');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middlewares/check-auth');
const router = express.Router();



router.post('/register', extractFile, async (req, res) => {

    if (!req.body.name) {
        return res.json({ success: false, message: "You must provide a name" })
    }
    if (!req.body.email) {
        return res.json({ success: false, message: "You must provide an email" })
    }
    if (!req.body.password) {
        return res.json({ success: false, message: "You must provide a password" })
    }
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        console.log(result);

        // const urls = [];
        // const uploader = async (path) => await cloudinary.uploads(path, "profilePic");
        // const { path } = req.file;
        // const newPath = await uploader(path);
        // urls.push(newPath);
        // fs.unlinkSync(path);


        const url = req.protocol + '://' + req.get('host');
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            // profilePicPath: url + "/images/" + req.file.filename
            profilePicPath: result.secure_url
        });

        let createdUser = await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET, { expiresIn: '24h' });
        res.json({
            success: true,
            token: token,
            message: "Account Registered Successfully!",
            userEmail: {
                email: createdUser.email
            },
            user: {
                id: createdUser._id,
                name: createdUser.name,
                email: createdUser.email,
                profilePicPath: createdUser.profilePicPath
            }
        })

    } catch (err) {
        if (err.code === 11000) {
            return res.json({ success: false, message: "Email already exists" })
        }
        if (err.errors) {
            if (err.errors.name) {
                return res.json({ success: false, message: err.errors.name.message })
            }
            if (err.errors.email) {
                return res.json({ success: false, message: err.errors.email.message })
            }
            if (err.errors.password) {
                return res.json({ success: false, message: err.errors.password.message })
            }
            if (err.errors.profilePicPath) {
                return res.json({ success: false, message: err.errors.profilePicPath.message })
            }
        }
        res.json({ success: false, message: "Error while saving User:- ", err })

    }

});

router.get('/checkEmail/:email', async (req, res) => {
    if (!req.params.email) {
        return res.json({ success: false, message: "E-mail is not provided" })
    }
    try {

        const user = await User.findOne({ email: req.params.email });
        if (user) {
            return res.json({ success: false, message: "Email already exists" })
        }
        if (!user) {
            return res.json({ success: true, message: "Email is available" })
        }
    }
    catch (err) {
        res.json({ success: false, message: "Error while searching Email:- ", err })
    }

});

router.post('/login', async (req, res) => {
    if (!req.body.email) {
        return res.json({ success: false, message: "E-mail is not provided" });
    }
    if (!req.body.password) {
        return res.json({ success: false, message: "Password is not provided" });
    }

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.json({ success: false, message: "Invalid Email." });
        }

        const validPassword = await user.comparePassword(req.body.password);
        if (!validPassword) {
            return res.json({ success: false, message: "Invalid Password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET, { expiresIn: '24h' });

        res.json({ success: true, message: "Login Successful!", token: token, user: { email: user.email } });

    } catch (err) {
        res.json({ success: false, message: err });
    }

});

router.get('/profile', checkAuth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userData.userId }).select('name email profilePicPath');
        if (!user) {
            return res.json({ success: false, message: "User not found!" });
        }
        res.json({ success: true, message: "User found", user: user });

    } catch (err) {
        res.json({ success: false, message: err });
    }
});

router.get('/publicProfile/:email', async (req, res) => {
    if (!req.params.email) {
        return res.json({ success: false, message: "No email is provided." });
    }
    try {

        let user = await User.findOne({ email: req.params.email }).select('-password');
        if (!user) {
            return res.json({ success: false, message: "Email not found." });
        }
        res.json({ success: true, user: user });
    } catch (error) {
        res.json({ success: false, message: error })
    }
});

router.get('/allUsers', async (req, res) => {
    try {
        let user = await User.find({}).select('-password').collation({ locale: "en", strength: 1 }).sort({ email: 1 });
        if (!user) {
            return res.json({ success: false, message: "No user found" });
        }
        res.json({ success: true, user: user });
    } catch (error) {
        res.json({ success: false, message: error });
    }
})


module.exports = router;