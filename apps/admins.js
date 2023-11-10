const Joi = require("joi")
const { User } = require("../models/user")
const  config  = require("config")
const  bcrypt  = require("bcrypt")

const adminsApp = require("../utils/gen/miniApp")()

function validateAdmin(obj){

    return Joi.object({
        father:Joi.string().email().min(3).max(20).required(),
        client:Joi.string().email().min(3).max(100).required(),
        password:Joi.string().min(8).max(1024).required()
    }).validate(obj)
}

adminsApp.post('/',async(req,res)=>{

    const appFather = config.get("father")
    const {error }= validateAdmin(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const { father,client,password } = req.body
    
    const dev = await User.findOne({ email:father })
    const pass = bcrypt.compareSync(password,dev.password)
    if(!dev) return res.status(401).send("Invalid User !")
    if(!pass) return res.status(400).send("Invalid Password")
    if(appFather !== father) return res.status(403).send("Forbidden Operation .....Don't Bother")

    const updated  = await User.findOneAndUpdate({ email:client },{ $set:{ isAdmin:true } },{ new:true })
    
    if(!updated) return res.status(500).send("Something Failed => Try Again Father....")

    res.send("Succesfully updated the Client .....")

})

module.exports = adminsApp