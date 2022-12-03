import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";


import fileHelpers from '../utils/fileHelpers';
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable,uploadBytes  } from "firebase/storage";
import { IconBase } from "react-icons";

const Input = ({file}) => {
//   const fileName = fileHelpers.getFileName(
//     file.content
// );
//   const fileExtension =
//         fileHelpers.getFileExtension(fileName);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [tap, setFile] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    setFile(null);
    setText("");
    setImg(null);
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          
          
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } 
    else if(tap){
      // const metadata ={
      //   contentType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

      // };
      const storageRef = ref(storage, uuid());
            // const storageRef = ref(storage, tap.name,uuid()+'.docx');
      const uploadTask = uploadBytesResumable(storageRef, tap);
      // const uploadTask = uploadBytes(storageRef, tap, metadata);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                tap: downloadURL,
                tap2 : tap.name,
              }),
            });
          });
        }
      );
    }
    else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          imgSend:currentUser.photoURL,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
      // var idMes =  uuid()
      // await updateDoc(doc(db, "chats", data.chatId), {
      //   [idMes]:{
      //     id: idMes,
      //     text,
      //     senderId: currentUser.uid,
      //     date: Timestamp.now(),
      //   },
      // });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
        // imgS:
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
    setFile(null);
  };
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Nhập nội dung..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        
        <input type="file"
          style={{ display: "none" }}
          id="tap"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="tap">
          <img src={Attach} alt="" />
        </label>
        
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>

{/* icon */}
   

    {/* <IconBase>
      
    </IconBase> */}



    </div>
  );
};
export default Input;
