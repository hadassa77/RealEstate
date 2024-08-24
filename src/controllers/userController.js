
const{registeruser,loginuser,getAgentsByLocation}=require('../services/userService');
const{validateToken}=require("../middleware/validatetokenHandler.js")

const getUsers = async (req, res) => {
    const { FirstName,LastName,Email,PhoneNumber,Password,Pincode,City,Role} = req.body;
    
  if ( !FirstName||!LastName||!Email||!PhoneNumber||!Password||!Pincode||!City||!Role) {
    return res.status(400).json({ message: 'All fields are mandatory' });
  }

  try {
    const result = await registeruser( FirstName,LastName,Email,PhoneNumber,Password,Pincode,City,Role);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Error adding user: ' + err.message });
  }
};



// @desc Get all login users
// @router GET /api/users/login
// @access public
const getloginUsers = async (req, res) => {
    const{Email,Password}=req.body;
      if(!Email){
        throw new Error('Email is mandatory!');
      }
      try{
        const result= await loginuser(Email,Password);
        res.status(201).json(result);
      }
      catch(err){
        res.status(500).json({error:'error logging'+err.message});
      }
  };
  
  const getAgents=async(req,res)=>{
    const{city}=req.body;
    try{
        const result=await getAgentsByLocation(city);
        res.status(201).json(result);
    }
    catch(err){
      res.status(500).json({error:'error logging'+err.message});
    }
};


  
  module.exports={getUsers,getloginUsers,getAgents}