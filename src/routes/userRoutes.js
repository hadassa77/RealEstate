const express=require('express');
const router=express.Router();
const{getUsers,getloginUsers, getAgents}=require("../controllers/userController");
const {validateToken}=require("../middleware/validatetokenHandler.js")

router.route('/register').post(getUsers);
router.route('/login').post(getloginUsers,validateToken);
router.route('/agent').get(getAgents);
 module.exports=router;
