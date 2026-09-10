import express from "express"
import dotenv from "dotenv"
import mongo from "mongoose"
import cors from "cors"
import rout from "./routes/post.js"
import routGET from "./routes/Getapi.js"
import routDEL from "./routes/deleteapi.js"
import routPATCH from "./routes/patch.js"
import mrcookie from "cookie-parser"
// import bb from "bcrypt"
// call data form env
dotenv.config()
const data = process.env.Mydata;
const port = process.env.port || 4000;
const app = express();
 
//middlewire
app.use(express.json())



try {
    mongo.connect(data).then(()=>{
    console.log("connected to database")
     app.listen(port,()=>{
   console.log("the server is working fine ") 
       })
})
} catch (error) {
    console.log("something is wrong")
}

const users = new mongo.Schema({
    firstname:String,
    lastname:String, 
    email:String,
    password:String,
    role:String
})

export const datamodule = mongo.model("SignedUser",users)
 
// Washa CORS kwa kutumia masharti uliyoweka
const corsValue= [              
    'https://webwithsam.github.io/myfirstfrontend/',
    "http://localhost:5174"           
];

const corsOptions = {
    origin: corsValue,       
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials: true                    
};

app.use(cors(corsOptions));
app.use(mrcookie())

//logout
app.post("/logout",(req,res)=>{
    //console.log('u want to logout right');
    res.clearCookie("token",{
                      
                      httpOnly: true,
                      secure: true,
                      sameSite: "strict",
                      path: "/"
                    })
    res.json({"message":"logout"})
})



// routes
app.use("/post/api/",rout);
app.use("/get/api/",routGET);
app.use("/delete/api/",routDEL);
app.use("/patch/api",routPATCH);






