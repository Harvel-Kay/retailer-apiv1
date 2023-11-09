const registerRoute = require("../utils/gen/miniApp")();
const { validateUser, User } = require("../models/user");
const { case_it } = require("../utils/gen/str");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { validNumber, thereErrors } = require("../utils/gen/validators");

registerRoute.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  console.log("Register Payload validation.....");
  const { username: u_name, email, confirm, password, phone } = req.body;
  const nameTaken = await User.findOne({ username: case_it(u_name) });
  const emailTaken = await User.findOne({ email });
  const phoneTaken = await User.findOne({ phone });

  if (nameTaken) return res.status(400).send("Username is taken");
  if (emailTaken) return res.status(400).send("Email already registered");
  if (password !== confirm)
    return res.status(400).send("Passwords didnt match");
  if (phoneTaken) return res.status(400).send("Phone is taken");

  const error_2 = validNumber({ name: "phone", value: phone }, {});
  if (thereErrors(error_2))
    return res.status(400).send(`Phone : ${error_2.phone}`);

  const salt = await bcrypt.genSalt(10);

  console.log("User Creation starter.....");
  const newbie = new User(
    _.pick(req.body, ["username", "email", "password", "phone"])
  );
  newbie.username = case_it(u_name);
  newbie.password = await bcrypt.hash(newbie.password, salt);
  console.log("User Creation Part 2.....");
  await newbie.save();
  res
    .set({
      ["access-control-expose-headers"]: "auth-key",
      ["auth-key"]: newbie.getToken(),
    })
    .send("Registered successfully ....");
});

module.exports = registerRoute;
