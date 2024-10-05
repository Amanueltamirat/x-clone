import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import {v2 as cloudinary} from 'cloudinary'
import Notification from '../models/notification.model.js'



export const getFollowingPosts = async(req,res)=>{
   
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
          return  res.status(404).json({error:"can't found user"})
        }
    
        const following = user.following;
    

        const feedPosts = await Post.find({user:{$in: following}})
        .sort({createdAt:-1})
        .populate({
            path:'user',
            select:'-password'
        })
        .populate({
            path:'comments.user',
            select:'-password'
        })
        if(feedPosts.length ===0){
            return res.status(201).json([])
        };
      
        res.status(201).json(feedPosts)
    } catch (error) {
        console.log('error in get following posts',error.message);
        res.status(500).json({error:'Internal server error'})
    }
}


export const createPost = async(req,res)=>{
    try {
        let {text} = req.body;
        let {img} = req.body;
        const userId = req.user._id
        const user = await User.findById(userId);
        if(!user){
            res.status(404).json({error:"user not found"});
        }
        if(!text && !img){
            return res.status(404).json({error:'post must have text or image'})
        }
        if(img){
            const res = await cloudinary.uploader.upload(img);
            img = res.secure_url
        }

        const newPost = new Post({
            user:userId,
            text,
            img
        })
        await newPost.save();
		res.status(201).json(newPost);
    } catch (error) {
        console.log('error creating post',error.message);
        res.status(404).json({error:'Internal server error'})
    }
} 
export const likeUnlikePost = async(req,res)=>{
    try {
        const userId = req.user._id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post){
            res.status(404).json({error:"Post not found"})
        };
        const userLikedPost = post.likes.includes(userId);
        if(post.likes.includes(userId)){
            await Post.updateOne({_id:postId},{$pull:{ likes:userId}})
            const updatedLikes = post.likes.filter((id)=>id.toString() !== userId.toString())
            return res.status(201).json(updatedLikes)
        }

          post.likes.push(userId);
          await post.save();
          const notification = new Notification({
            type:'like',
            from:userId,
            to:post.user

          })
          await notification.save();
          const updatedLikes = post.likes
          res.status(201).json(updatedLikes)

    } catch (error) {
        console.log('error in like/unlike post',error.message);
        res.status(404).json({error:"Internal server error"});
    }
} 
export const commentOnPost = async(req,res)=>{
  try {
    const {text} = req.body;
    const userId = req.user._id;
    const postId = req.params.id

    if(!text){
        return res.status(404).json({error:"Text field is required"})
    }

    const post = await Post.findById(postId);
    if(!post){
        return res.status(404).json({error:"Post not found"})
    }
    const comment = {user:userId,text}
    post.comments.push(comment);
    await post.save();
    res.status(201).json(post)
  } catch (error) {
    console.log('error in commenting',error.message);
    res.status(404).json({error:'Internal server error'})
  }

} 
export const deletePost = async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error:'Post Not Found'})
        }
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(404).json({error:"You are not authorized to delete this post"})
        }
        if(post.img){
            const imgId = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId)
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(201).json({message:'post deleted successfully'});

    } catch (error) {
        console.log('error in deleting post',error.message);
        res.status(404).json({error:'Internal server error'})
    }
} 
export const getAllPosts = async(req,res)=>{
try {
    const posts = await Post.find().sort({createdAt:-1}).populate({
        path:'user',
        select:'-password'
    }).populate({
        path:'comments.user',
        select:'-password'
    })
    if(posts.length === 0){
        res.status(201).json([])
    }
    res.status(201).json(posts)
} catch (error) {
    console.log('error in getting all psots',error.message);
    res.status(404).json({error:'Internal server error'})
}
}

export const getUserPosts = async(req,res)=>{
   try {
     const {username} = req.params;
    const user = await User.findOne({username});
    if(!user){
        return res.status(404).json({error:"user not found"});
    }
    const userPosts = await Post.find({user:user._id}).sort({createdAt:-1}).populate({
        path:'user',
        select:'-password'
    })
    .populate({
        path:'comments.user',
        select:'-password'
    })
    res.status(201).json(userPosts)
   } catch (error) {
    console.log('error in get user posts',error.message);
    res.status(500).json({error:'Internal server error'})
   }
}