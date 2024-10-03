import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { deleteNotifications, getAllNotifications } from '../controllers/notification.controller.js';

const notificationRoute = express.Router();

notificationRoute.get('/',protectRoute,getAllNotifications)
notificationRoute.delete('/',protectRoute,deleteNotifications)
export default notificationRoute