import { createContext, useContext ,useState} from "react"
import { getAuth , createUserWithEmailAndPassword , signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {child, getDatabase, ref, set,get, onValue, remove} from 'firebase/database';
import { initializeApp } from "firebase/app";
import {getFirestore,addDoc,updateDoc,deleteDoc,doc,collection,getDoc,
    query,
    where,getDocs
} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  databaseUrl:""
};



const firebaseapp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseapp);
const auth = getAuth(firebaseapp);
const database = getDatabase(firebaseapp);

const FirebaseContext = createContext();

export const useFirebase = ()=>useContext(FirebaseContext);

export default function FirebaseContextProvider(props){

     const [loggedInUser,setLoggedInUser] = useState(null);
     const [userName,setUserName] = useState();
     

     const signup = async (email, password) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Login success:", result);
            // alert("Login success!");
            return result;
        } catch (error) {
            console.error("Login failed:", error);
            return "FAILURE";
            // alert("Login failed: " + error.message);
            // throw error;
        }
    };

    const login = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            console.log("Login success:", result);
            // alert("Login success!");
            return result;
        } catch (error) {
            console.error("Login failed:", error);
            return "FAILURE";
            // alert("Login failed: " + error.message);
            // throw error;
        }
    };




    const insertInDB = (key,data)=>{
        try {
            console.log("insert in DB",key,data);
             set(ref(database,key),{
                data
            })
            console.log("insert in AFTER DB",key,data);
        } catch (error) {
            console.error(error,"Failed in insert");
            return "FAILURE";
        }
       return "SUCCESS";
    }

    const getDataFromDB = async (key)=>{
     
    console.log("key",key);
    try {
      const snap = await get(child(ref(database),key));
      const data = await snap.val();
      console.log("getDataFromDB",data);
      return data;
     
    } catch (error) {
         console.error(error,"Failed in insert");
         return "FAILURE";
    }      
  
    }

    const deleteDataFromDB = async (key)=>{
     
    console.log("key",key);
    try {
      const snap = await remove(ref(database,key));
    //   const data = await snap.val();
      console.log("getDataFromDB",snap);
      return snap;
     
    } catch (error) {
         console.error(error,"Failed in insert");
         return "FAILURE";
    }      
  
    }

    const realTimeChangesHandler = (key)=>{
        console.log("key",key);
        onValue(ref(database,key),(snap)=>setUserName(snap.val().name))
    }


    const logout = ()=>{
        signOut(auth);
    }

    const writeDoc = async (key,option)=>{
        const result = await addDoc(collection(firestore,key),{
            option
        })
        console.log(result,"result");
    }

    const writeInsideDoc = async (key,option)=>{
        const result = await addDoc(collection(firestore,'cities/Vm35PNJcAn7LM9zbbD6q/places'),{
            id:1,
            name: "sector 135",
            near: "okhla",
        })
        console.log(result,"result");
    }

    const getDocument = async (key)=>{
        const docRef = doc(firestore,key);
        const result = await getDoc(docRef);
        console.log(result.data(),"result");      
    }

    const getDocByQuery = async (key)=>{
        const collectionRef = collection(firestore,key);
        const result = query(collectionRef,where("name",'==','chandigarh'));
        const snap  = await getDocs(result);
        snap.forEach(element => {
            console.log("element",element.data());
        });
    }

    const updateDocument = async ()=>{
        const docRef = doc(firestore,"cities","Vm35PNJcAn7LM9zbbD6q");
        updateDoc(docRef,{
            near:"both tanical",
        })

        getDocument();
    }

    return (<FirebaseContext.Provider 
                value={{login,
                        signup,
                        insertInDB,
                        loggedInUser,
                        setLoggedInUser,
                        logout,
                        writeDoc,
                        writeInsideDoc,
                        getDocument,
                        getDocByQuery,
                        updateDocument,
                        getDataFromDB,
                        userName,
                        setUserName,
                        realTimeChangesHandler,
                        deleteDataFromDB,
                        }}>
                    {
                        props.children
                    }
            </FirebaseContext.Provider>)
}