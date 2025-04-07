import { GoogleLogin } from "@react-oauth/google";
import userService from "../services/userService";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const LoginPage = () => {
  const dispatch = useDispatch();

  const handleSuccess = async (response) => {
    try {
      const { credential } = response;
      const res = await userService.loginWithGoogle(credential);

      localStorage.setItem("accessToken", res.accessToken);
      
      const userRes = await userService.getUserProfile(res.accessToken);
      
      dispatch(
        setUser({
          fullName: userRes.fullName,
          email: userRes.email,
          _id: userRes._id,
          lock: userRes.lock,
          role: userRes.role,
          isAuthenticated: true,
        })
      );
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.response?.data || error.message);
    }
  };

  const handleError = () => {
    console.error("Lỗi đăng nhập Google");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default LoginPage;
