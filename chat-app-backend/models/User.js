const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Please provide a username!!'],
        unique: [true, 'Please use another username!!']
    },
    email:{
        type: String,
        required: [true, 'Please provide a email!!'],
        unique: [true, 'Please use another email!!']
    },
    password:{
        type: String,
        required:[true, "Please provide a password"]
    },
    isAvatarImageSet:{
        type: Boolean,
        default: false
    },
    avatarImage:{
        type: String,
        default: ''
    }
},
{
    timestamps: true
});

userSchema.pre('save', async function(next)
{

    if(!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isValidatePassword = async function(userSendPassword)
{
    return await bcrypt.compare(userSendPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);