import React, { useEffect, useState, createContext, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userTeam, setUserTeam] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // ✅ New state for admin status
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserRole(userData.role || null);
          setUserTeam(userData.team || null);
          setIsAdmin(userData.admin || false); // ✅ Store the admin boolean
        } else {
          setUserRole(null);
          setUserTeam(null);
          setIsAdmin(false);
        }

        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setUserTeam(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { currentUser, userRole, userTeam, isAdmin }; // ✅ Now available in useAuth()

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
