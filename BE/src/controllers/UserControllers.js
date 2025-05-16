import userService from "../services/UserServices.js";

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    const user = await userService.loginWithGoogle(token);

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

const updateUserProfile = async (req, res) => {
  try {
    const { phoneNumber, dateOfBirth, gender } = req.body;
    const user = await userService.updateUserProfile(req.user.id, {
      phoneNumber,
      dateOfBirth,
      gender,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default { googleLogin, getUserProfile, updateUserProfile };