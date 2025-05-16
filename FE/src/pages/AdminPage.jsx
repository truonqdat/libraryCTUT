import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import AdminHeader from "../components/AdminHeader/AdminHeader";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminPage(props) {
  const user = useSelector((state) => state.user);
  console.log(user);
  

  if (!user || (user.currentUser.role !== "admin" && user.currentUser.role !== "librarian")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <AdminHeader />
      <AdminSidebar />
    </div>
  );
}

export default AdminPage;
