import React, { useState } from "react";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import {  signInWithPhoneNumber,updateProfile } from "firebase/auth";
import { firebase, auth , db, storage} from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc  } from "firebase/firestore";
import { createUserWithEmailAndPassword} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";


const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState('');
  const [result, setResult] = useState('');


  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const phoneNumber =e.target[0].value;
        
    // const otp = e.target[3].value;
    const displayName = e.target[3].value;
    const email = e.target[4].value;
    const password = e.target[5].value;
    const file = e.target[6].files[0];

    try {
        // let verify = new RecaptchaVerifier('recaptcha-container', {
        //     'size': 'invisible'
        // }, auth);
        
        //Create user
        const res = await createUserWithEmailAndPassword(auth, email, password);

          const date = new Date().getTime();
             const storageRef = ref(storage, `${displayName + date}`);
             await uploadBytesResumable(storageRef, file).then(() => {
               getDownloadURL(storageRef).then(async (downloadURL) => {
                 try {
                   //Update profile
                   await updateProfile(res.user, {
                     displayName,
                     photoURL: downloadURL,
                   });
                   //create user on firestore
                   await setDoc(doc(db, "users", res.user.uid), {
                     uid: res.user.uid,
                     displayName,
                     email,
                     phoneNumber,
                     password,
                     photoURL: downloadURL,
                   });
                   //create empty user chats on firestore
                   await setDoc(doc(db, "userChats", res.user.uid), {});
                  //  navigate("/");
                 } catch (err) {
                   console.log(err);
                   setErr(true);
                   setLoading(false);
                 }
               });
             });

    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  const signin = () => {
  
    let verify = new RecaptchaVerifier('recaptcha-container', {
              'size': 'invisible'
          }, auth);
          
    signInWithPhoneNumber(auth, phoneNumber, verify).then((result) => {
            setResult(result);
            // navigate("/");
    })
        .catch((err) => {
          alert(err);
        });
  }


  const ValidateOtp = async(e) => {
    if (otp === null) return;
    
    result.confirm(otp).then((result) => {
      // navigate("/");
  //     alert(navigate("/"));
  alert("Tạo tài khoản thành công");
  
    })
    .catch((err) => {
      alert("Tọa tài khoản thất bại");
   })
};

  

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">App chat</span>
        <span className="title">đăng kí</span>
        <form onSubmit={handleSubmit}> 
        <div>
        <input  placeholder="Số điện thoại" value={phoneNumber} onChange={(e) => { setPhoneNumber(e.target.value) }}/>
            <div id="recaptcha-container"></div>
           
        </div>       

            <input type="text" placeholder={"Enter your OTP"}
                      onChange={(e) => { setOtp(e.target.value) }} />
        <input type="text" placeholder="tên người dùng" />
        <input required type="email" placeholder="email đăng nhập" />
          <input  type="password" placeholder="mật khẩu" />
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            {/* <img src={Add} alt="" /> */}
            <span>Add avatar</span>
          </label>
        <button onClick={ValidateOtp} >Đăng ký</button>
        </form>
        <button onClick={signin}>Send OTP</button>
        <p>Quay lại trang đăng nhập<Link to="/Login"> đăng nhập</Link></p>

      </div>
    </div>
  );
};

export default Register;