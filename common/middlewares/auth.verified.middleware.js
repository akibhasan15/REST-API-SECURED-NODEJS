require('dotenv').config({path:__dirname+'/./../../.env'})
const UserModel =require('../../users/models/users.model');
const EMAIL_SECRET = process.env.EMAIL_SECRET;
const jwt=require('jwt-simple')

exports.isUserVerified= async(req,res,next)=>{
    let user=await UserModel.findByEmail(req.body.email);
    if(user.isVerified){
        console.log(user)
      return  next()
    }
    else{
       return res.status(401).send('Sorry your email account is not yet verified')
    }
} 
exports.verifyEmailToken=async (req,res)=>{
  let emailTokenEncoded = req.params.token;
        console.log(`Token from post request ${emailTokenEncoded} `);
        const user= await jwt.decode(emailTokenEncoded,EMAIL_SECRET)
        // res.status(200).send(req.params);
        console.log("decoded user info:",user);
  if(new Date(user.expiry) > new Date()){
    UserModel.findByEmail(user.email)
        .exec(function(err,user){
        if(err){
            console.log(err);
            res.json(err);
        }else if(!user){
            console.log("User not found");
            res.json({error : "User not found"});
        }else{
            console.log("User found");
            user.isVerified = true;
            user.save(function(update_err,update_data){
                if(update_err){
                    console.log(update_err);
                    res.json(update_err);
                }else{
                    console.log("Email is verified of user ",user.email);
                    res.json({result : 1});
                }
            });
        }
    });
}else{
    console.log("Link is expired");
    res.json({error : "Link is expired"});
}
}