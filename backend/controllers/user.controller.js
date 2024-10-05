import NotificationModel from "../models/notification.model.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import {v2 as cloudinary} from 'cloudinary'

export const getUserProfile = async(req,res)=>{
    const {username} = req.params;
    try {
        const user = await User.findOne({username}).select('-password')
        if(!user){
            return res.status(404).json({error:error.message})
        }
        res.status(201).json(user)
    } catch (error) {
        console.log('error in geting user profile',error.message);
        res.status(500).json({error:error.message})
    }
};
export const followUnfollowUser = async(req,res)=>{
    try {
        const {id} = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id)

        if(id === req.user._id.toString()){
            return res.status(404).json({error:"you can't follow/unfollow yourself"})
        }

        if(!currentUser || !userToModify){
            return res.status(404).json({error:"user not found"})
        }

        const isFollowing = currentUser.following.includes(id);
        if(isFollowing){
            //unfollow user
            await User.findByIdAndUpdate(id,{
                $pull:{followers:req.user._id}
            })
            await User.findByIdAndUpdate(req.user._id,{
                $pull:{following:id}
            })
    const newNotification = new NotificationModel({
        from:req.user._id,
        to:userToModify._id,
        type:'follow'
    })
    await newNotification.save()
            res.status(201).json({message:'unfolloweed successfully'})
        } else{
            //follow user
            await User.findByIdAndUpdate(id,{
                $push:{followers:req.user._id}
            })
            await User.findByIdAndUpdate(req.user._id,{
                $push:{following:id}
            })
            //send notificstion to user
             res.status(201).json({message:'followeed successfully'})
        }
    } catch (error) {
       console.log('error in followUnfollowUser',error.message);
      res.status(500).json({error:error.message})  
    }
};
export const getSuggestedUsers = async(req,res)=>{
    try {
        const userId = req.user._id;
        const usersFollowedByMe = await User.findById(userId).select('following');
const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{ $sample: { size: 10 } },
		]);

const filteredUsers = users.filter(user=>!usersFollowedByMe.following.includes(user._id));
const suggestedUsers = filteredUsers.slice(0,4);
suggestedUsers.forEach(user=>user.password = null)
res.status(201).json(suggestedUsers)
    } catch (error) {
        console.log('errors on suggested users',error.message)
        res.status(500).json({error:`Internal server error ${error.message}`})
    }
}
export const updateUserProfile = async(req,res)=>{
    const {fullName, username,email,confirmPassword,newPassword,bio,link} = req.body;
    let {profileImg,coverImg} = req.body;

    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        if((!confirmPassword && newPassword) || (!newPassword && confirmPassword)){
            return res.status(404).json({error:'please provide current and new pasword'})
        }

        if(confirmPassword && newPassword){
            const isMatch = await bcrypt.compare(newPassword,user.password);
     
        if(!isMatch){
            return res.status(404).json({error:"current password is not correct"})
        }
        if(newPassword.length < 6){
            return res.status(404).json({error:'password must be at least six characters'})
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt)
           }
        if(profileImg){
            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0])
            }
            const res = await cloudinary.uploader.upload(profileImg)
            profileImg = res.secure_url;
        }
        if(coverImg){
            if (user.coverImg) {
			await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
			}
              const res = await cloudinary.uploader.upload(coverImg);
              coverImg = res.secure_url;
        }
    user.fullName = fullName || user.fullName,
    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;
    user = await user.save();
    user.password = null;
    res.status(201).json(user)
    } catch (error) {
        console.log('user updating error',error.message);
        res.status(500).json({error:'Internal server error'})
        }
}