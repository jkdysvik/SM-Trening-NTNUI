import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import styles from './stylesheets/Auth.module.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        navigate('/');
      }
          } catch (err) {
      setError('Feil e-post eller passord');
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.authTitle}>Logg inn</h2>
      {error && <p className={styles.authError}>{error}</p>}
      <form onSubmit={handleLogin} className={styles.authForm}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            className={styles.authInput}
          />
        </div>
        <div>
          <label>Passord:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            className={styles.authInput}
          />
        </div>
        <button type="submit" className={styles.authButton}>Logg inn</button>
      </form>
    </div>
  );
}

export default LoginPage;
