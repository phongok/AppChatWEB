import React, { useContext, useState,useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  onSnapshot
} from "firebase/firestore";
import Img from "../img/img.png";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

import { getDownloadURL, ref, uploadBytesResumable,uploadBytes  } from "firebase/storage";

import {  storage } from "../firebase";
import { v4 as uuid } from "uuid";



const Search = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [user , setUser] = useState(null);
  const [users=[], setUsers] = useState([]);

  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
    console.log(user)
    
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;


        const res2 = await getDoc(doc(db, "groupChats", combinedId));
      if(!res2.exists()){
    await setDoc(doc(db, "groupChats", combinedId),{ 
      [currentUser.uid]:{ 
        uid :currentUser.uid,
        displayName: currentUser.displayName,
        photoURL:currentUser.photoURL }
      });
    
    await updateDoc(doc(db, "groupChats", combinedId), {
              [user.uid]: { 
                uid :user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
          },
        });
      
  }

        
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            idAdmin:currentUser.uid

          },
          [combinedId+".idChat"]:combinedId,
          [combinedId+ ".img"]: user.photoURL,
          [combinedId+ ".name"]: user.displayName,
          [combinedId + ".date"]: serverTimestamp(),
        });
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL, 
            idAdmin:currentUser.uid
          },
          [combinedId+".idChat"]:combinedId,
          [combinedId+".img"]:currentUser.photoURL,
          [combinedId+ ".name"]: user.displayName,
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null);
    setUsername("")
  };
  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Nhập tên người dùng"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      <form action="">
      {err && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
      </form>
  {/* <div>
    <button>
    <a href="#my-dialog">Tạo nhóm</a>
    </button>
    <div className="dialog overlay" id="my-dialog" >
      
      <div className="dialog-body">
        <a href="/" onClick={xoaTrang}>X</a>
        <h2>Tạo nhóm chat</h2>
        
        <input type="text" placeholder="Nhập tên nhóm"
        onChange={(e) => setNamegp(e.target.value)}
        ></input>
        
        <input
          type="text"
          onKeyDown={handleKeys}
          onChange={(e) => setUsersname(e.target.value)}
          placeholder="Tìm thành viên"
        />
        <br></br>
        <form action="">
        {user && (
        <div className="userChat" onClick={themNhom}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
        </form>
      <h3>Danh sách thành viên</h3>  
      
      {users.map((user) =>(
        <div key={user.id}>
          <div className="userChat">
        <img src={user.photoURL} alt="" />
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
      </div>
      </div>
      ))
      }
        <button onClick={handleSelects} >Tạo nhóm</button>
      </div>
       
    </div> 
  </div> */}
  {/* Modal */}
  <button
        className="openModalBtn"
        onClick={() => {
          setModalOpen(true);
        }} 
      >
        Tạo Nhóm
      </button>
      {modalOpen && <Modal setOpenModal={setModalOpen} />} 
  </div>
  );

  // Modal


  function Modal ({setOpenModal}){
    const [namegp , setNamegp] = useState(null);
    const [usersname, setUsersname] = useState("");

    const handleKeys = (e) => {
      e.code === "Enter" && handleSearchs();
    };
    const handleSearchs = async () => {
      const q = query(
        collection(db, "users"),
        where("displayName", "==", usersname)
      );
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
      } catch (err) {
        setErr(true);
      }
    };
    const themNhom =  async () => {
      users.push(user)
      setUser(null);
    }
    const handleSelects = async () => {
      var groupId = currentUser.uid
      for(var i = 0; i < users.length  ; i++){
        groupId +=  users[i].uid
      }
  const res2 = await getDoc(doc(db, "groupChats", groupId));
  if(!res2.exists()){
    await setDoc(doc(db, "groupChats", groupId),{ 
      [currentUser.uid]:{ 
        uid :currentUser.uid,
      displayName: currentUser.displayName,
      photoURL:currentUser.photoURL }
      });
    for (var i = 0; i < users.length ; i++){
              await updateDoc(doc(db, "groupChats", groupId), {
              [users[i].uid]: { 
                uid :users[i].uid,
                displayName: users[i].displayName,
                photoURL: users[i].photoURL,
          },
        });
      }
  }
      try {
        const res = await getDoc(doc(db, "chats", groupId));
        if (!res.exists()) {
          //create a chat in chats collection
          await setDoc(doc(db, "chats", groupId), { messages: [] });
          //create user chats
          for (var i = 0; i < users.length  ; i++){
            await updateDoc(doc(db, "userChats", currentUser.uid), {
              [groupId + ".userInfo"]: { 
                uid: users[i].uid,
                displayName: namegp,
                photoURL: users[i].photoURL, 
              },
              [groupId +".idChat"]:groupId,
              [groupId +".img"]:currentUser.photoURL,
              [groupId + ".name"]:namegp,
              [groupId + ".date"]: serverTimestamp(),
              [groupId+".idAdmin"]:currentUser.uid,
              
            });
          }
          for (var i = 0; i < users.length  ; i++){
            await updateDoc(doc(db, "userChats", users[i].uid), {
              [groupId + ".userInfo"]: {
                uid: currentUser.uid,
                displayName: namegp,
                photoURL: currentUser.photoURL,
              },
              [groupId+".idAdmin"]:currentUser.uid,
              [groupId+".idChat"]:groupId,
              [groupId+".img"]:currentUser.photoURL,
              [groupId+ ".name"]:namegp,
              [groupId + ".date"]: serverTimestamp(),
            });
  
          
          } 
        }
      } catch (err) {

      }
      setUser(null);
      setUsername("");
      setUsers([]);
    };
  
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn" >
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="title">
          <h2>Tạo Nhóm Chat</h2>
        </div>
        <div>
        <input
          type="text"
          onKeyDown={handleKeys}
          onChange={(e) => setUsersname(e.target.value)}
          placeholder="Tìm thành viên"
        />
        <input type="text" placeholder="Nhập tên nhóm"
        onChange={(e) => setNamegp(e.target.value)}
        ></input>

        <br></br>
        <form action="">
        {user && (
        <div className="userChat" onClick={themNhom}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
        </form>
        <h4>Danh Sách thành viên</h4>
        {users.map((user) =>(
        <div key={user.id}>
          <div className="userChat">
        <img src={user.photoURL} alt="" />
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
      </div>
      </div>
      ))
      }
        </div>
        <div className="chats">
    </div>
        <div className="footer">
          
          <button onClick={handleSelects}>Tạo Nhóm</button>
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  }
};

export default Search;
