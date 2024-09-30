import jwt from 'jsonwebtoken';

export const generateTokenAndSaveCookies = (usedId,res)=>{
    const token = jwt.sign({usedId},process.env.JWT_SECRET,{
        expiresIn:'20d'
    })
    res.cookie('jwt',token,{
        maxAge:20*24*60*1000,
        httpOnly:true,
        sameSite:'strict',
        secure:process.env.NODE_ENV !=='development'
    })
}