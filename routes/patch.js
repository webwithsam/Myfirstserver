import express from "express";
import { datamodule } from "../server.js";
const routPATCH = express.Router();

routPATCH.patch("/:id",async(req,res)=>{
     // console.log(req.params.id)
     // console.log(req.body)
// console.log( req.params.id)
 await datamodule.findByIdAndUpdate(req.params.id, req.body)
     res.json({"message":"this"})
})
 export default routPATCH;  