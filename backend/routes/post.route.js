import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { commentOnPost, createPost, deletePost, getAllPosts, getFollowingPosts, getUserPosts, likeUnlikePost } from '../controllers/post.controller.js';

const postRoute = express.Router();
postRoute.get('/allposts',protectRoute,getAllPosts);
postRoute.get('/:username',protectRoute,getUserPosts)
postRoute.get('/following', protectRoute,getFollowingPosts)
postRoute.post('/createpost',protectRoute,createPost);
postRoute.post('/like/:id',protectRoute,likeUnlikePost);
postRoute.post('/comment/:id',protectRoute,commentOnPost);
postRoute.delete('/:id',protectRoute,deletePost)

export default postRoute