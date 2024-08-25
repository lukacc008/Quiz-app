const User = require("../model/User");

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  /* THIS WAS THE CODE BEOFRE USING MONGO DB, JSON FORMAT IS NO LONGER NEEDED */

  // const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
  // const currentUser = { ...foundUser, refreshToken: '' };
  // usersDB.setUsers([...otherUsers, currentUser]);
  // await fsPromises.writeFile(
  //     path.join(__dirname, '..', 'model', 'users.json'),
  //     JSON.stringify(usersDB.users)
  // );

  // foundUser is the document that I find if it exists
  // and then I am able to update that document with .save();
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

module.exports = { handleLogout };
