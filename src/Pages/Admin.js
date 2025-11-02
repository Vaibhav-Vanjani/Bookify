import { useNavigate } from "react-router-dom";
import "../Css/Admin.css"; // Link your CSS file
import ProtectedRoute from "../Components/ProtectedRoute";
import { useSelector } from "react-redux";

export default function Admin() {
  const navigate = useNavigate();
  
  const isAdminSignIn = useSelector((state)=>state.admin);

  if(!isAdminSignIn.isSignIn){
    return <ProtectedRoute />
  }

  return (
    <section className="admin-panel">
      <h2 className="admin-title">📘 Admin Panel</h2>
      <ul className="admin-menu">
        <li onClick={() => navigate('/admin/order-status')}>📦 Order Status</li>
        <li onClick={() => navigate('/admin/new-book')}>➕ Add New Book</li>
        <li onClick={() => navigate('/admin/list-book')}>📚 List of Books</li>
      </ul>
    </section>
  );
}
