const mongoose = require('mongoose');
const blogSchema = mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, "Title must be 3 characters long"],
        maxLength: [320, "Title must not be more than 320 characters"],
    },
    body: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, "Body must be 3 characters long"],
        maxLength: [500, "Body must not be more than 500 characters"],
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    imagePath: {
        type: String,
        // required: [true, 'Please add a Blog Image']
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: {
        type: Array,
    },
    dislikes: {
        type: Number,
        default: 0
    },
    dislikedBy: {
        type: Array
    }
});

// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//         return next();
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();

// });

// userSchema.methods.comparePassword = async function (password) {
//     return await bcrypt.compare(password, this.password);
// };

module.exports = mongoose.model('Blog', blogSchema);