import React, { useContext ,useEffect, useState} from "react";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import {  deleteDoc } from "firebase/firestore";
import { doc, updateDoc,onSnapshot, deleteField } from "firebase/firestore";
import { HiOutlineUsers,HiOutlineUserPlus } from "react-icons/hi2";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
  const [userId , setUserId] = useState(null);
  const [chats, setChats] = useState([]);
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const [usernameDelete, setUsernameDelete] = useState("");
  const [dataDelete , setDataDelete] = useState(null);
  const [user , setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [err, setErr] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenAdd, setModalOpenAdd] = useState(false);
  
  const xemThanhVien =async()=>{
    setModalOpen(true);

    //realtime
    const unsub = onSnapshot(doc(db, "groupChats", data.chatId), (doc) => {
      setChats(doc.data());
    });
    return () => {
      unsub();
    };
  }

  //Out group
  const outGroup= async(e)=>{
  const cityRef2 = doc(db, "groupChats", data.chatId);
  const cityRef = doc(db, "userChats", currentUser.uid);
  await updateDoc(cityRef, {
    [data.chatId]: deleteField()

  // await deleteDoc(doc(db,"groupChats",data.chatId))

});

await updateDoc(cityRef2, {
  [currentUser.uid]: deleteField()
});


  }
  const deleteGroup=async ()=>{
    console.log(data.chatId)
    console.log(data.user.idAdmin)
    if(currentUser.uid === data.user.idAdmin){
      await deleteDoc(doc(db, "chats", data.chatId));

    }
    else{
      alert("Bạn không phải trưởng nhóm");
    }

  }
 
  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.name}</span>
        <div className="chatIcons">
          {/* <label
            onClick={() => {
             setModalOpenAdd(true);}}
          >
          <img src={Add} alt=""  />
          {modalOpenAdd && <ModalAdd setOpenModal={setModalOpenAdd} />} 
          </label> */}
          
          <div>
          <div className="search">
      <div className="searchForm">

  </div>
  </div>
  </div>
  {/* <button
        className="openModalBtn"
       onClick={() => {
        setModalOpenAdd(true);
        }}
      >
        add
      </button> */}
      <HiOutlineUserPlus size={25}
      onClick={() => {
        setModalOpenAdd(true);
        }}></HiOutlineUserPlus>
      {modalOpenAdd && <ModalAdd setOpenModal={setModalOpenAdd} />} 
  {/* <button
        className="openModalBtn"
      onClick={xemThanhVien}   
      >
        Xem
      </button> */}
      <HiOutlineUsers onClick={xemThanhVien} size={25}>
          </HiOutlineUsers>
      {modalOpen && <Modal setOpenModal={setModalOpen} />} 
          <button onClick={outGroup}>outGroup</button>
          <button onClick={deleteGroup}>deleteGroup</button>
        </div>
      </div>
      <Messages />
      <Input/>
    </div>
  );


  // Modal xem Thành Viên


  function Modal ({setOpenModal}){

    const xoaTv=async()=>{
      if(currentUser.uid === data.user.idAdmin){
        const dlUserChat = doc(db,"userChats", usernameDelete[0]);

        await updateDoc(dlUserChat,{
          [data.chatId]:deleteField()
        })
        const cityRef = doc(db, "groupChats", data.chatId);
        await updateDoc(cityRef, {
          [usernameDelete[0]]:deleteField()
      })  
      }
      else{
        alert("Bạn không phải trưởng nhóm");
      }
      
    
  }
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
          <h2>Danh Sách Thành viên nhóm</h2>
        </div>
        
        <div className="chats">

        {Object.entries(chats)?.map((chat) => (
        <div
          className="userChatXem"
          key={chat[0]}
          onClick={(e) => setUsernameDelete(chat)}
        >
          <img src={chat[1].photoURL} alt="" />
          <div className="userChatInfoXem">

            <span>{chat[1].displayName}</span>
          </div>
          <button onClick={xoaTv}>xóa</button>
        </div>
      )
      )}

    </div>
        <div className="footer">
          
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

  function ModalAdd ({setOpenModal}){
    const [username, setUsername] = useState("");


    const addUser=(e)=>{
      e.code === "Enter" && handleSearch();
    }
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
    };
    const themThanhVien= async()=>{
      console.log(data)
    
      await updateDoc(doc(db, "userChats", user.uid), {
        [data.chatId + ".userInfo"]: {
          uid: currentUser.uid,
          displayName: data.user.name,
          photoURL: currentUser.photoURL,
        },
        [data.chatId+".idChat"]:data.chatId,
        [data.chatId+".img"]:currentUser.photoURL,
        [data.chatId+ ".name"]:data.user.name,
        [data.chatId + ".date"]: serverTimestamp(),
      });
      // console.log(data.chatId)
      // console.log(user)
  
  
      await updateDoc(doc(db, "groupChats", data.chatId), {
        [user.uid]: { 
          uid :user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
      },
      });
  
      setUser(null);
      setUsername("");
    }
  



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
          <h2>Thêm thành viên</h2>
        </div>
        
        <div className="chats">

        <input
          type="text"
          placeholder="Tìm thành viên mới"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={addUser}
          value={username}
        />
        {user && (
        <div className="userChat"  onClick={themThanhVien}>
          <img src={user.photoURL} alt=""  />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
          
        </div>
      )}
       <h3>Danh sách thành viên</h3>  

    </div>
        <div className="footer">
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
export default Chat;
