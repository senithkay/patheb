import express from "express";


const router = express.Router();

router.post("/", async (req, res) => {
    try{
        console.log(req.body);
    }
    catch (err){
        console.error(err);
    }
})

export default router;