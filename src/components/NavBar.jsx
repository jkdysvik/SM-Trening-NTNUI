import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAuth, signOut } from 'firebase/auth';
import styles from './stylesheets/NavBar.module.css';

const NavBar = () => {
    const { currentUser, userTeam, isAdmin } = useAuth(); // ✅ Get isAdmin from context
    const navigate = useNavigate();

    const handleLogOut = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <nav className={styles.navbar}>
            <h1>SM Treningsforespørsel</h1>
            

            {currentUser ? (
                <React.Fragment>
                    {isAdmin ? (
                        <Link to="/admin">Admin Dashboard</Link>
                    ) : (
                        <>
                            <Link to="/">Hjem</Link>
                            <Link to="/requests">Mine Forespørsler</Link>
                        </>
                    )}
                    <p>Logget inn som: {isAdmin ? "Admin" : userTeam || ""}</p> {/* ✅ Show "Admin" if isAdmin is true */}
                    <button onClick={handleLogOut}>Logg ut</button> 
                </React.Fragment>
            ) : (
                <React.Fragment>
                    
                    <Link to="/login" style={{ marginLeft: '600px' }}>Logg inn</Link>
                    <Link to="/register">Registrer</Link>
                </React.Fragment>
            )}
        </nav>
    );
};

export default NavBar;
