import express from "express";
import { datamodule } from "../server.js";
import jwt from "jsonwebtoken"
const routGET = express.Router();


routGET.get("/all",async(req,res)=> {
    const ds = await datamodule.find({},{email:1,role:1})
    let auth = req.cookies.token;
    if(!auth){
      res.json({"token":false});
    }
    else{
      const decod = jwt.verify(
      auth,
      process.env.siri
      );
      //console.log(decod);
      res.json({"data":ds,"token":true});
    }  
})

routGET.get("/users",async(req,res)=>{
   console.log("i cant get you")
  let auth = req.cookies.token;
    console.log(auth)
  if(!auth){
    res.json({"token":false})
    // console.log("notoken")
  }
  // auth = auth.split(" ")[1];
  else{
    
    const decod = jwt.verify(
    auth,
    process.env.siri
    );
     //console.log(decod.role)
     const ds = await datamodule.find({},{firstname:1,lastname:1,email:1,role:1})
     const dsone = await datamodule.findOne({_id:decod.id},{firstname:1,lastname:1,email:1,role:1})
     if(decod.role==="Admin"){
      // console.log("hapo fresh")
      res.json(ds);
     }
     if(decod.role==="User"){
      // console.log(" hii ni user")
      // console.log(dsone)
      res.json([dsone]);
     } 
  } 

})

export default routGET;   