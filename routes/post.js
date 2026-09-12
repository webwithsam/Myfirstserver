import express from "express";
import { datamodule } from "../server.js";
import encrypt from "bcrypt";
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config
const route = express.Router();


// main Adimn hapa 
const mainAdminEmail = process.env.masterpin;
const passmainAdmin = process.env.masterpassword;

// validation  of login 
const logintest = () =>{
  let e =loginifo.email.trim();
  let p = loginifo.password.trim();
  if (e === "") {
    // console.log("email is empty");
   res.json({
      "state":"stop",
        "value":"Email can never be empty",
                  });
    return false;
                      }
  if (e.length != 10 ) {
      console.log( e.length,"email less than 10");
      res.json({
          "state":"stop",
            "value":"wrong Email and Password",
      });
      return false;
    }
  if (e.charAt(0) !== "0") {
      res.json({
          "state":"stop",
            "value":"wrong Email and Password",
      });
      return false;
    }
  if (e.charAt(1) != "7" && e.charAt(1) != "6") {
      console.log("email value of 7 or 6 problem");
      res.json({
          "state":"stop",
            "value":"wrong Email and Password",
              });
      return false;
                  }
  if (p === "") {
      console.log(p.length, "pass not greater than 3");
      res.json({
          "state":"stop",
            "value":"Password can never be Empty",
            });
      return false;
              }
  if (p.length <= 6) {
      console.log(p.length, "pass not greater than 3");
      res.json({
          "state":"stop",
            "value":"Wrong Email and Password",
              });
      return false;
                    }
  else { return true;}
}
 // validation of signup
const signupvalidation = ()=>{
    let e = signupData.email.trim();
    let p = signupData.password.trim();
    let fn = signupData.firstname.trim();
    let sc = signupData.lastname.trim();
    let cpm = signupData.confirmpass.trim();

    if (fn === "") {
      console.log("name is empty");
      res.json({
         "state":"stop",
         "value":"firstname can never be empty",
       });
        return false;
    }
    if (sc === "") {
      console.log("lastname is empty");
      res.json({
        "state":"stop",
         "value":"second name can never be empty",
      });
      return false;
    }
    if (e === "") {
      console.log("email is empty");
      res.json({
        "state":"stop",
         "value":"email can never be empty",
       });
      return false;
    }
    if (p === "") {
      console.log("p is empty");
      res.json({
        "state":"stop",
         "value":"pasword can never be empty",
       });
      return false;
    }
    if (cpm === "") {
      console.log("confirm pp  is empty");
      res.json({
        "state":"stop",
         "value":"confirm can never be empty",
      });
      return false;
    }
    if (e.length != 10) {
      console.log(e.length, "not valid number");
      res.json({
        "state":"stop",
         "value":"email not oky",
       });
      return false;
    }
    if (e.charAt(0) !== "0") {
      console.log("email value of 0 problem");
      res.json({
        "state":"stop",
         "value":"email start only with 0 ",
       });
      return false;
    }
    if (e.charAt(1) != "7" && e.charAt(1) != "6") {
      console.log("email value of 7 or 6 problem");
      res.json({
        "state":"stop",
         "value":"email second value is 7 0r 6",
      });
      return false;
    }
    if (p.length <= 6) {
      console.log(p.length, "pass not greater than 3");
      res.json({
        "state":"stop",
         "value":"password lenght is short < 6",
      });
      return false;
    }
    if (p != cpm) {
      // console.log("password not the same as cnf");
      res.json({
        "state":"stop",
         "value":"password not the same",
      });
      return false;
    } 
    else {
       return true;
      }
}

route.post("/admin/login", async(req,res)=>{
  // console.log("samuel = ", process.env.siri)
   const  loginifo = req.body; 
   /// check kama kuna main Admin hapa 
  if (loginifo.email === mainAdminEmail){
      // console.log("this is oky")
    if(loginifo.password === passmainAdmin){
          // console.log("this is super Adimn");
      const token = jwt.sign(
        {
          superAdmin: mainAdminEmail
        },
          process.env.siri,
        {
          expiresIn:"5.5min"
        }
      )
      
       res.cookie('token',token,
          {
                httpOnly:true,
                secure:true,
                sameSite:"lax",
                maxAge:60000
          }
       )
       res.json({'gonext':true});
       
    }
  }
});

route.post("/user/login", async(req,res)=>{
   const  loginifo = req.body;  
     //logintest()
      if(logintest){
        const  checkemail = await datamodule.findOne({email:loginifo.email})
        // console.log(checkemail)
        if(checkemail){
          if(await encrypt.compare(loginifo.password,checkemail.password)){          
              const token = jwt.sign(
                {
                role:checkemail.role,
                id:checkemail._id
                },
                process.env.siri,
                { expiresIn:"20min"}
              );
                res.cookie("token",token,{
                  maxAge: 120000,
                  httpOnly: true,
                  secure: true,
                  sameSite: "none"
                });    
                res.json({
                    "state":"nothing",
                    "value":"u have succefull login ",
                    "gonext":true,
              
                }); 
               
                
          }
           else{
            res.json({
                "state":"stop",
                "value":"wrong password boss",
                "gonext":false
            });
           }
        }
        else{
           res.json({
            "state":"stop",
            "value":"Wrong Email and Password",
            "gonext":false
            
                });
        }    
    }
   
});
  
route.post("/signup",async(req,res)=>{
  const signupData = req.body;
   console.log(signupData)  
  if(signupvalidation){
      const  checkemail = await datamodule.findOne({email:signupData.email});
      if(!checkemail){
        signupData.password = await encrypt.hash(signupData.password,10)
        console.log(signupData.password)
        signupData.role = "User";
        datamodule.create(signupData)
        console.log(signupData)
        res.json({
              "state":"false",
              "value":"data saved in the server  successfully you may login",
        });
      }
      else{
          res.json({
              "state":"stop",
              "value":"Email already used",
          });
      }
  }
  // datamodule.create(signupData)
  // console.log(signupData)
});

export default route;
 