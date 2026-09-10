import express from "express";
import { datamodule } from "../server.js";
const routDEL = express.Router();

routDEL.delete("/:id",async(req,res)=>{
// console.log( req.params.id)
 await datamodule.deleteOne({_id:req.params.id})
     res.json({"message":"One is deleted"})
})
 export default routDEL; 