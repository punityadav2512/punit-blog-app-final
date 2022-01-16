const express = require('express');
const User = require('../models/user');
const Blog = require('../models/blog');
const extractBlog = require('../middlewares/file2');
const cloudinary = require('../middlewares/cloudinary');
// const jwt = require('jsonwebtoken');
const checkAuth = require('../middlewares/check-auth');
const router = express.Router();


router.post('/newBlog', checkAuth, extractBlog, async (req, res) => {
    if (!req.body.title) {
        return res.json({ success: false, message: "Blog title is required" });
    }
    if (!req.body.body) {
        return res.json({ success: false, message: "Blog Body is required" });
    }
    if (!req.body.createdBy) {
        return res.json({ success: false, message: "Blog creator is required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    const url = req.protocol + '://' + req.get('host');
    let blog = new Blog({
        title: req.body.title,
        body: req.body.body,
        createdBy: req.body.createdBy,
        // imagePath: url + "/blogs/" + req.file.filename
        imagePath: result.secure_url
    });

    try {
        let createdBlog = await blog.save();
        res.json({
            success: true,
            message: "Blog saved successfully!",
            // blog: {
            //     id: createdBlog._id,
            //     title: createdBlog.email,
            //     imagePath: createdBlog.imagePath
            // }
        })
    } catch (error) {
        if (err.errors) {
            if (err.errors.title) {
                return res.json({ success: false, message: err.errors.title.message })
            }
            if (err.errors.body) {
                return res.json({ success: false, message: err.errors.body.message })
            }
            if (err.errors.createdBy) {
                return res.json({ success: false, message: err.errors.createdBy.message })
            }
            if (err.errors.imagePath) {
                return res.json({ success: false, message: err.errors.imagePath.message })
            }
        }
        res.json({ success: false, message: "Error while creating blog:- ", err })
    }
});


router.get('/allBlogs', async (req, res) => {
    let blogs = await Blog.find({}).sort({ '_id': -1 });
    try {
        if (!blogs) {
            return res.json({ success: false, message: "No blogs created yet!" });
        }
        res.json({ success: true, blogs: blogs });

    } catch (error) {
        res.json({ success: false, message: error });
    }
});

router.get('/singleBlog/:id', checkAuth, async (req, res) => {

    if (!req.params.id) {
        return res.json({ success: false, message: "No blog ID is provided" });
    }
    try {
        const blog = await Blog.findOne({ _id: req.params.id });

        if (!blog) {
            return res.json({ success: false, message: "No blog found!" });
        }

        const user = await User.findOne({ _id: req.userData.userId });
        if (!user) {
            return res.json({ success: false, message: "User is not authenticated." });
        }
        if (user.email !== blog.createdBy) {
            return res.json({ success: false, message: "You are not authorized to edit this blog." });
        }
        res.json({ success: true, blog: blog, message: "blog found" });

    }
    catch (error) {
        res.json({ success: false, message: error });
    }

});

router.put('/updateBlog', checkAuth, async (req, res) => {
    if (!req.body._id) {
        return res.json({ success: false, message: "No blog ID is provided." });
    }
    try {
        let blog = await Blog.findOne({ _id: req.body._id });
        if (!blog) {
            res.json({ success: false, message: "Blog id is not found" });
        };
        let user = await User.findOne({ _id: req.userData.userId });
        if (!user) {
            return res.json({ success: false, message: "User is not authenticated." });
        }

        if (user.email !== blog.createdBy) {
            return res.json({ success: false, message: "You are not authorized to edit this blog." });
        }

        blog.title = req.body.title;
        blog.body = req.body.body;

        await blog.save();

        res.json({ success: true, message: "Blog updated successfully" });



    } catch (error) {
        res.json({ success: false, message: error });
    }
});


router.delete('/deleteBlog/:id', checkAuth, async (req, res) => {
    if (!req.params.id) {
        return res.json({ success: false, message: "No blog ID is provided." });
    }
    try {
        const blog = await Blog.findOne({ _id: req.params.id });

        if (!blog) {
            return res.json({ success: false, message: "No blog found." });
        }
        const user = await User.findOne({ _id: req.userData.userId });
        if (!user) {
            return res.json({ success: false, message: "You are not authenticated to delete this blog." });
        }
        if (user.email !== blog.createdBy) {
            return res.json({ success: false, message: "You are not authorized to delete this blog." });
        }

        await blog.deleteOne({});

        res.json({ success: true, message: "Blog deleted successfully." });

    } catch (error) {
        res.json({ success: false, message: error });
    }

});



router.put('/likeBlog', checkAuth, (req, res) => {
    if (!req.body.id) {
        res.json({ success: false, message: 'no id was provided!' });
    } else {
        Blog.findOne({ _id: req.body.id }, (err, blog) => {
            if (err) {
                res.json({ success: false, message: 'invalid blog id' });
            } else {
                if (!blog) {
                    res.json({ success: false, message: "blog was not found" })
                } else {
                    User.findOne({ _id: req.userData.userId }, (err, user) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            if (!user) {
                                res.json({ success: false, message: 'Could not authenticate user' });
                            } else {
                                if (user.email === blog.createdBy) {
                                    res.json({ success: false, message: 'Cannot like your own post' })
                                } else {
                                    if (blog.likedBy.includes(user.email)) {
                                        res.json({ success: false, message: "You already liked this post" });
                                    } else {
                                        if (blog.dislikedBy.includes(user.email)) {
                                            blog.dislikes--;
                                            const arrayIndex = blog.dislikedBy.indexOf(user.email);
                                            blog.dislikedBy.splice(arrayIndex, 1);
                                            blog.likes++;
                                            blog.likedBy.push(user.email);
                                            blog.save((err) => {
                                                if (err) {
                                                    res.json({ success: false, message: err });
                                                } else {
                                                    res.json({ success: true, message: "Blog liked!" });
                                                }
                                            });
                                        } else {
                                            blog.likes++;
                                            blog.likedBy.push(user.email);
                                            blog.save((err) => {
                                                if (err) {
                                                    res.json({ success: false, message: err });
                                                } else {
                                                    res.json({ success: true, message: "Blog liked!" });
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    })
                }
            }
        });
    }
})


router.put('/dislikeBlog', checkAuth, (req, res) => {
    if (!req.body.id) {
        res.json({ success: false, message: 'No id was provided!' });
    } else {
        Blog.findOne({ _id: req.body.id }, (err, blog) => {
            if (err) {
                res.json({ success: false, message: 'invalid blog id' });
            } else {
                if (!blog) {
                    res.json({ success: false, message: "blog was not found" })
                } else {
                    User.findOne({ _id: req.userData.userId }, (err, user) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            if (!user) {
                                res.json({ success: false, message: 'Could not authenticate user' });
                            } else {
                                if (user.email === blog.createdBy) {
                                    res.json({ success: false, message: 'Cannot dislike your own post' })
                                } else {
                                    if (blog.dislikedBy.includes(user.email)) {
                                        res.json({ success: false, message: "You already disliked this post" });
                                    } else {
                                        if (blog.likedBy.includes(user.email)) {
                                            blog.likes--;
                                            const arrayIndex = blog.likedBy.indexOf(user.email);
                                            blog.likedBy.splice(arrayIndex, 1);
                                            blog.dislikes++;
                                            blog.dislikedBy.push(user.email);
                                            blog.save((err) => {
                                                if (err) {
                                                    res.json({ success: false, message: err });
                                                } else {
                                                    res.json({ success: true, message: "Blog disliked!" });
                                                }
                                            });
                                        } else {
                                            blog.dislikes++;
                                            blog.dislikedBy.push(user.email);
                                            blog.save((err) => {
                                                if (err) {
                                                    res.json({ success: false, message: err });
                                                } else {
                                                    res.json({ success: true, message: "Blog disliked!" });
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    })
                }
            }
        });
    }
});




module.exports = router;