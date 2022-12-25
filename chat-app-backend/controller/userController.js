const messageModel = require('../models/messageModel');
const { find } = require('../models/User');
const User  = require('../models/User');

exports.saveUserDetails = async (req, res, next) => {

    try
    {
        const { username, email, password } = req.body;
        
        const userFromDb = await User.findOne({ email });
        
        if (userFromDb)
            res.status(400).json({
                success: false,
                message: 'User already present please login!!',
                userInfo: userFromDb
            });
        
        let user = await User.create({
            username,
            email,
            password
        });

        user.password = undefined;

        res.status(200).json({
            success: true,
            userInfo: user
        });

    }
    catch (error) 
    {
        console.log(error);
        if(error)
            res.status(500).json({
                success: false,
                message: 'Server error!!'
            })
    }

}

exports.verifyUserDetails = async (req, res, next) => {

    try
    {
        const { username, password } = req.body;
        
        const userFromDb = await User.findOne({ username });
        
        if (!userFromDb)
            res.status(400).json({
                success: false,
                message: 'User was not present please register first!!',
                userInfo: userFromDb
            });
        
        if(!(await userFromDb.isValidatePassword(password)))
            res.status(400).json({
                success: false,
                message: 'Please validate the credentials!!',
                userInfo: {}
            });

        userFromDb.password = undefined;

        res.status(200).json({
            success: true,
            userInfo: userFromDb
        });

    }
    catch (error) 
    {
        console.log(error);
        if(error)
            res.status(500).json({
                success: false,
                message: 'Server error!!'
            })
    }

}

exports.setTheUserAvatar = async (req, res, next) => {

    try
    {
        let {avatarImage, userId} = req.body;
        if(!avatarImage)
        {
            res.status(400).json({
                success: false,
                message: 'Please share the avatar!!'
            })
        }

        const user = await User.findByIdAndUpdate(userId, {
            avatarImage,
            isAvatarImageSet: true
        }, {
            runValidators: false,
            new: true,
        });

        user.password = undefined;

        res.status(200).json({
            success: true,
            user: user
        })
    }
    catch(err)
    {
        console.log(err);
    }

}

exports.getAllTheUsers = async (req, res, next) => {

    try 
    {
        let userId = req.params.id;

        if(!userId)
            throw new Error('Please provide a userId');
        let users = await User.find({_id: {$ne: userId}}).select([
            "email",
            "username",
            "avatarImage",
            "_id",
            "isAvatarImageSet"
        ]);

        res.status(200).json({
            success: true,
            users
        });
    } 
    catch (err) 
    {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }

}

exports.addMessage = async (req, res, next) => {

    try 
    {
        const {from, to, message} = req.body;
        const data = await messageModel.create({
            message: {text: message},
            users: [from, to],
            sender: from
        });
        if(data)
            return res.json({success:true, msg: "Message added succesfully!!"});

        return res.json({success:false, msg: "Failed to add message to the database!!"});
    } 
    catch (error) 
    {
        next(error);
    }


}

exports.getAllMessage = async (req, res, next) => {

    try 
    {
        const {from, to} = req.body;
        const messages = await messageModel.find({
            users: {
                $all: [from, to]
            }
        }).sort({updatedAt : 1});

        const projectMsg = messages.map(msg => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text
            }
        });

        res.status(200).json({success: true, projectMsg});
    } 
    catch (error) 
    {
        next(error);
    }
    
}
