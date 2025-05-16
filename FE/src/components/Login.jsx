import { GoogleLogin } from "@react-oauth/google";
import userService from "../services/userService.js";
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
          user: {
            fullName: userRes.fullName,
            email: userRes.email,
            _id: userRes._id,
            lock: userRes.lock,
            role: userRes.role,
          },
          token: res.accessToken,
        })
      );
    } catch (error) {
      console.error("Login error:", error);
      // Xử lý lỗi đăng nhập
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
