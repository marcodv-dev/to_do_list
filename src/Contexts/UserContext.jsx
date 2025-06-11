
import { createContext, useState } from 'react';
import { useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [username, setUsername] = useState('');
  const [foto, setFoto] = useState('profile_icon.png');
  const [categorie, setCategorie] = useState([]);
  const [attivita, setAttivita] = useState([]);

  useEffect(() => {
  }, [username]);

  useEffect(() => {
  }, [foto]);

  useEffect(() => {
  }, [categorie]);

  useEffect(() => {
  }, [attivita]);

  return (
    <UserContext.Provider value={{ username, setUsername, foto, setFoto, categorie, setCategorie, attivita, setAttivita }}>
      {children}
    </UserContext.Provider>
  );
}