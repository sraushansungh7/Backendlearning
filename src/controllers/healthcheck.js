import { ApiResponse } from "../utils/api-res.js";

const heathchec=(req,res)=>{
    try{
        res
        .status(250)
        .json(new ApiResponse(450,{message:"Server is healtTy"},'my message'))
      console.log("healt check will send");
    }
    catch (err){
        console.log(err)
    }

    
}
export {heathchec};