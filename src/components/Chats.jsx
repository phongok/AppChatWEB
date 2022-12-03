import { doc, onSnapshot,where ,collection,getDoc} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

import {
  query,
  getDocs,
} from "firebase/firestore";




const Chats = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [username, setUsername] = useState("");

  const [user , setUser] = useState(null);

  const [users=[], setUsers] = useState([]);
  const [err, setErr] = useState(false);


  // lấy dữ liệu chát 
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

  // truyền dữ liệu
  const handleSelect=async (u) => {
    // console.log(u.userInfo.displayName)
  const docRef = doc(db, "chats", u.idChat);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
} else {
  alert("Nhóm đã bị nhóm trưởng giải tán");
}
    dispatch({ type: "CHANGE_USERS", payload: u });

  };


  // quản lí thêm sửa xóa

  // const xemDanhSach = async (u) => {
  //   const q = query(
  //   collection(db, "userChats"),
  //     where("idChat", "==", u.idChat )

  //   );
  //   try {
  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach((doc) => {
  //       setUser(doc.data());
  //     });
  //   } catch (err) {
  //     setErr(true);
  //   }
  // }
  // const xemUser = () => {
  //   console.log()
  //   console.log(users)

  // }


  return (
    <div className="chats">
      {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
        <div
          className="userChat"
          key={chat[0]}
          onClick={() => handleSelect(chat[1])}
        >
          <img src={chat[1].img} alt="" />
          <div className="userChatInfo">
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
