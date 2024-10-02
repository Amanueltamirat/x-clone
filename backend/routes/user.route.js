import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUserProfile } from '../controllers/user.controller.js';

const userRoute = express.Router();

userRoute.get('/profile/:username',protectRoute,getUserProfile);
userRoute.get('/suggested',protectRoute,getSuggestedUsers);
userRoute.post('/follow/:id',protectRoute,followUnfollowUser);
userRoute.post('/update',protectRoute,updateUserProfile);

export default userRoute