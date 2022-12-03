import React, { Children, useContext, useEffect, useRef,useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import Img from "../img/img.png";
import { v4 as uuid } from "uuid";
import "./Modal.css";
import { FileIcon, defaultStyles } from 'react-file-icon';
import { HiArrowUturnLeft } from "react-icons/hi2";
import { VscFile } from "react-icons/vsc";


import { doc, updateDoc, deleteField ,arrayUnion,deleteDoc,Timestamp,onSnapshot} from "firebase/firestore";
import { db, storage } from "../firebase";
import Messages from "./Messages";


import Modal from "./Modal";

const Message = ({ message }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  // console.log(message)



  // xoas tin nhasn
  const test=async()=>{

    // chuyen tin nhắn 

    // console.log(message)

    // console.log(message)


    // const cityRef = doc(db, "chats", data.chatId);

    // await updateDoc(cityRef, {
    //   messages:{
    //     0:deleteField(),
    //   }
    // })
  }
  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo"> 
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              // : data.user.photoURL
              // : data.user.img
              // : data.user.userInfo.photoURL
              : message.imgSend
              
          }
          alt=""
        />
         {/* <span>just now</span> */}
      </div>
      <div className="messageContent" onClick={test}>
        {message.text && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="" />}
        {message.tap && 
        <button className="file" > 
          <VscFile size={35}></VscFile>
          <a href={message.tap}>
            {message.tap2}</a>
        </button>}
        <div className="App">
      <HiArrowUturnLeft size={20} className="chuyen"
       onClick={() => {
        setModalOpen(true);
      }}
      >

      </HiArrowUturnLeft>


      {modalOpen && <Modal setOpenModal={setModalOpen} />}
    </div>
      </div>
    </div>
  );

  function Modal({ setOpenModal }) {
    const [chats, setChats] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
    const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);


  const handleSelect= async (u)=>{
    // console.log(u.idChat)
    // console.log(currentUser.uid)
    console.log(message)

    if(message.img){
            await updateDoc(doc(db, "chats", u.idChat), {
              messages: arrayUnion({
                id: uuid(),
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: message.img,
              }),
            });

    }
    else if(message.tap){
      await updateDoc(doc(db, "chats", u.idChat), {
        messages: arrayUnion({
          id: uuid(),
          senderId: currentUser.uid,
          date: Timestamp.now(),
          tap: message.tap,
          tap2 : message.tap2,
        }),
      });

    }

    else if(message.text){
      await updateDoc(doc(db, "chats", u.idChat), {
      messages: arrayUnion({
        id: uuid(),
        text:message.text,
        imgSend:currentUser.photoURL,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });
  }


  }

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="title">
          <h2>Chuyển tiếp</h2>
          
        </div>
        <div>
        <input
          type="text"
        //   onKeyDown={handleKeys}
        //   onChange={(e) => setUsersname(e.target.value)}
          placeholder="Tìm người dùng"
        />
        <h4>Danh sách</h4>
        </div>

        <div className="chats">
      {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
        <div
          className="userChatModal"
          key={chat[0]}
          onClick={() => handleSelect(chat[1])}
        >
          <img src={chat[1].img} alt="" />
          <div className="userChatInfoModal">
            <span>{chat[1].name}</span>
          </div>
        </div>
      ))}
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
export default Message;
