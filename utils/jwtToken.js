export const generateToken=(user,message,statusCode,res)=>{

    const token=user.generateJsonWebToken();
    // console.log(token)
    let cookieName="";
    if(user.role=="Admin"){
         cookieName="adminToken"
    }else if(user.role=="Patient"){
         cookieName="patientToken"
    }else{
         cookieName="doctorToken"
    }
   
    
    res.status(statusCode)
    res.cookie(cookieName,token,{
            httponly:true,
            secure:true,
            sameSite:"None",
        expires:new Date(
            Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000),
            
        }).json({
        success:true,
        message,
        user,
        token
    })
}