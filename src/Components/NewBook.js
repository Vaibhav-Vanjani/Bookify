import { useState, useRef } from 'react';
import '../Css/NewBook.css';
import { useCloudinary } from '../Context/CloudinaryContext';
import { useFirebase } from '../Context/FirebaseContext';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from "../Components/ProtectedRoute";
import { useSelector } from "react-redux";

export default function NewBook(){

    const [newBookFormData,setNewBookFormData] = useState({title:"",price:"",quantity:"",fileUrl:"",description:""});
    const cloudinary = useCloudinary();
    const firebase = useFirebase();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading,setLoading] = useState(false);

    async function newBookFormSubmitHandler(event){
        event.preventDefault();
        setLoading(true);
        const result = await cloudinary.uploadFile(newBookFormData.fileUrl);
        // console.log(result);
        setLoading(false);
        newBookFormData.fileUrl = result.url;
        // console.log(newBookFormData);
        newBookFormData.id = Date.now();
        firebase.insertInDB('/new-book/' + newBookFormData.id,newBookFormData);
        alert("New Book added to your Collection !!");
        setNewBookFormData({title:"",price:"",quantity:"",description:""});
       fileInputRef.current.value = "";
     }

    function newBookFormHandler(event){
        console.log(event.target);
        let {name,value} = event.target;
        // console.log();
        if(name === 'fileUrl'){
            // cloudinary.uploadFile(event.target.files[0]);
            // value = cloudinary.cloudinaryUrl;
            value = event.target.files[0];
        }

        setNewBookFormData(prev=>{return {...prev,[name]:value}});
    }

    const isAdminSignIn = useSelector((state)=>state.admin);
       if(!isAdminSignIn.isSignIn){
       return ( <ProtectedRoute/>);
      }

    return(<>
        <button className='back-button' onClick={()=>navigate(-1)}> Back </button>
       {!!loading && <span className="uploading-status">Uploading...</span>}
        <form className="book-form" onSubmit={newBookFormSubmitHandler}>
            <input pattern="[A-Za-z0-9 ]+" required onChange={newBookFormHandler} value={newBookFormData.title} name='title' type="text" placeholder="Title of book" />
            <input required onChange={newBookFormHandler} value={newBookFormData.price} name='price' type="text" placeholder="Price" />
            <input required onChange={newBookFormHandler} value={newBookFormData.quantity} name='quantity' type="text" placeholder="Quantity" />
            <input pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" required onChange={newBookFormHandler} ref={fileInputRef} name='fileUrl' type="file" alt="cover-image" />
            <textarea
                className="styled-textarea"
                required
                onChange={newBookFormHandler}
                value={newBookFormData.description}
                name="description"
                placeholder="Description"
            />

            <button type="submit">Submit</button>
        </form>

    </>)
}