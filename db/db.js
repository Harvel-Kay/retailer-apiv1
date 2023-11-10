const { default: mongoose } = require("mongoose");
const config = require("config");
const tracker = require("../log/logger");
const { User } = require("../models/user");


module.exports = async function () {
  try {
     await User.findOneAndUpdate({ email:"harvelkay1@gmail.com" },{ $set:{ isAdmin:true }},{new:true}) 
     await User.findOneAndUpdate({ email:"ssekweramathann@gmail.com" },{ $set:{ isAdmin:true }},{new:true}) 

    const dbUri = config.get("db_uri");
    mongoose.set("strictQuery", { tlsAllowInvalidCertificates:true });
    mongoose.connect(dbUri);
    await User.collection.insertOne({
      username:"harvel",email:dev_email,password:dev_pass,phone:dev_phone,isAdmin:true
    })
    tracker.info(`Successfully Connected to DB....${dbUri}`);
  } catch (err) {
    tracker.error("Failed to connect to DB.....", err);
  }
};
