import { useEffect, useState } from "react";
import { useFirebase } from "../Context/FirebaseContext";
import '../Css/OrderStatus.css'
import { useNavigate } from "react-router-dom";
import { FaLock } from 'react-icons/fa';
import ProtectedRoute from "../Components/ProtectedRoute";
import { useSelector } from "react-redux";

export default function OrderStatus(){

    const firebase = useFirebase();
    const navigate = useNavigate();
    const [userOrderIds,setUserOrderIds] = useState([]);
    useEffect(()=>{
        async function getOrderUserTable() {
             const response = await firebase.getDataFromDB('/order-user');
             console.log("order-status",response);
             if(response){
                const arr = [];
                for(const key in response){
                    arr.push(response[key].data);
                }
                setUserOrderIds([...arr]);
             }
        }
       getOrderUserTable();
    },[]);

    const isAdminSignIn = useSelector((state)=>state.admin);
   if(!isAdminSignIn.isSignIn){
   return ( <ProtectedRoute/>);
  }

   return (
  <>
  <button className="back-button" onClick={()=>navigate(-1)}> Back </button>
    <div className="table-container">
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Order Time</th>
          </tr>
        </thead>
        <tbody>
          {userOrderIds.sort((a,b)=>b.orderId - a.orderId).map((item, index) => (
            <tr key={item.orderId}>
              <td>{item.orderId}</td>
              <td>{item.userId}</td>
              <td>{(new Date(item.orderId))?.toDateString() +" " + (new Date(item.orderId))?.toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

}