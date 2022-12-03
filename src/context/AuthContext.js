import { createContext, useEffect, useState,GruseEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log(user);
    });

    return () => {
      unsub();
    };
  }, []);
  // GruseEffect(() => {
  //   const unsub = onAuthStateChanged(auth, (users) => {
  //     setCurrentUser(users);
  //     console.log(users);
  //   });

  //   return () => {
  //     unsub();
  //   };
  // }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
    
  );
};
