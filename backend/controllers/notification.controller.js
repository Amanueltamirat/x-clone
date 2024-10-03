import NotificationModel from "../models/notification.model.js";


export const getAllNotifications = async(req,res)=>{
    try {
        const userId = req.user._id;
        const notification  = await NotificationModel.find({to:userId}).populate({
            path:'from',
            select:'username, profileImg'
        })
        await NotificationModel.updateMany({to:userId},{read:true});
        res.status(201).json(notification)
    } catch (error) {
        console.log('error in getting notification',error.message);
        res.status(404).json({error:"Internal server error"})
    }
}
export const deleteNotifications = async(req,res)=>{
    try {
       const userId = req.user._id;
       await NotificationModel.deleteMany({to:userId})
       res.status(201).json({message:'Notification deleted successfully'})
        
    } catch (error) {
         console.log('error in getting notification',error.message);
        res.status(404).json({error:"Internal server error"})
    }
}