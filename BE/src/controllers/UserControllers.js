import userService from "../services/UserServices.js";

const googleLogin = async (req, res) => {
    console.log(req.body);
    
  try {
    const { token, fullName } = req.body;
    
    const user = await userService.loginWithGoogle(
      token,
      fullName
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
      const user = await userService.getUserProfile(req.user.id); 
      res.status(200).json(user);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

export default { googleLogin, getUserProfile };
