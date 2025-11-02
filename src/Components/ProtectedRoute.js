import { FaLock } from 'react-icons/fa';
import '../Css/ProtectedRoute.css' 

export default function ProtectedRoute(){
 
   return (
    <div className="protected-notice">
      <FaLock className="lock-icon" />
      <p>Please sign in to access this protected route.</p>
    </div>
  );
}