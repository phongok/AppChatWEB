// import "./Modal.css";
// import { db } from "../firebase"
// import { doc, onSnapshot,where ,collection, getDoc} from "firebase/firestore";
// import React, { useContext, useEffect, useState,useRef } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { ChatContext } from "../context/ChatContext";
// import Messages from "./Messages";


// function Modal({ setOpenModal }) {
//     const [chats, setChats] = useState([]);
//     const { currentUser } = useContext(AuthContext);
//     const { data } = useContext(ChatContext);

//   useEffect(() => {
//     const getChats = () => {
//       const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
//         setChats(doc.data());
//       });

//       return () => {
//         unsub();
//       };
//     };

//     currentUser.uid && getChats();
//   }, [currentUser.uid]);


//   const TestModal=()=>{

//   }

//   return (
//     <div className="modalBackground">
//       <div className="modalContainer">
//         <div className="titleCloseBtn">
//           <button
//             onClick={() => {
//               setOpenModal(false);
//             }}
//           >
//             X
//           </button>
//         </div>
//         <div className="title">
//           <h2>Chuyển tiếp</h2>
          
//         </div>
//         <div>
//         <input
//           type="text"
//         //   onKeyDown={handleKeys}
//         //   onChange={(e) => setUsersname(e.target.value)}
//           placeholder="Tìm người dùng"
//         />
//         <h4>Danh sách</h4>
//         </div>

//         <div className="chats">
//       {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
//         <div
//           className="userChatModal"
//           key={chat[0]}
//         //   onClick={() => handleSelect(chat[1])}
//         onClick={TestModal}
//         >
//           <img src={chat[1].img} alt="" />
//           <div className="userChatInfoModal">
//             <span>{chat[1].name}</span>
//           </div>
//         </div>
//       ))}
//     </div>
//         <div className="footer">
//           <button
//             onClick={() => {
//               setOpenModal(false);
//             }}
//             id="cancelBtn"
//           >
//             Cancel
//           </button>
//           <button>Chuyển</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Modal;
