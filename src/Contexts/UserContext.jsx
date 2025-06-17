
import { createContext, useState } from 'react';
import { useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [fotoURL, setFotoURL] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser) {
        setEmail(savedUser.email);
        setUsername(savedUser.username);
      }
      setLoading(false);
    }, []);

  return (
    <UserContext.Provider value={{ email, setEmail, username, setUsername, fotoURL, setFotoURL, loading }}>
      {children}
    </UserContext.Provider>
  );
}