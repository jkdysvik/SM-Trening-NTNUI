import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase'; 
import { doc, setDoc } from 'firebase/firestore';
import styles from './stylesheets/Auth.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [team, setTeam] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        team: team,
        email: email,
      });

      navigate('/');
    } catch (error) {
      setError('Feil ved registrering. Prøv igjen.');
    }
  };

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.authTitle}>Registrer</h1>
      {error && <p className={styles.authError}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div>
          <label>Båt (Team): </label>
          <select
            id="teamSelect"
            required
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className={styles.authSelect}
          >
            <option value="">Velg båt</option>
            <option value="Herrer 1">Herrer 1</option>
            <option value="Herrer 2">Herrer 2</option>
            <option value="Damer 1">Damer 1</option>
            <option value="Damer 2">Damer 2</option>
          </select>
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.authInput}
          />
        </div>

        <div>
          <label>Passord:</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.authInput}
          />
        </div>

        <button type="submit" className={styles.authButton}>Registrer</button>
      </form>
    </div>
  );
};

export default Register;
