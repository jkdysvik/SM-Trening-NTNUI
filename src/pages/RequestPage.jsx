import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import styles from './stylesheets/RequestPage.module.css';

function RequestsPage() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    async function fetchRequests() {
      setLoading(true);
      setError(null);

      try {
        const q = query(
          collection(db, 'requests'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const userRequests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(userRequests);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('Could not load requests.');
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, [currentUser]);

  // ✅ Function to delete a request
  const handleDelete = async (requestId) => {
    if (!window.confirm('Er du sikker på at du vil slette denne forespørselen?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'requests', requestId));
      setRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId)); // ✅ Update state
    } catch (err) {
      console.error('Error deleting request:', err);
      alert('Kunne ikke slette forespørselen. Prøv igjen.');
    }
  };

  return (
    <div className={styles.requestsContainer}>
      <h2 className={styles.requestsTitle}>Mine Forespørsler</h2>

      {loading && <p className={styles.loadingText}>Laster...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {!loading && requests.length === 0 && <p className={styles.noRequests}>Ingen forespørsler funnet.</p>}

      {!loading && requests.length > 0 && (
        <table className={styles.requestsTable}>
          <thead>
            <tr>
              <th>Dato</th>
              <th>Starttid</th>
              <th>Slutttid</th>
              <th>Lag</th>
              <th>Status</th>
              <th>Handling</th> {/* ✅ New column for delete button */}
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.date}</td>
                <td>{req.startTime}</td>
                <td>{req.endTime}</td>
                <td>{req.team}</td>
                <td className={
                  req.approved === "Venter" ? styles.orangeText :
                  req.approved === "Godkjent" ? styles.greenText :
                  req.approved === "Avslått" ? styles.redText : ''
                }>{req.approved}</td>
                <td>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDelete(req.id)}
                  >
                    Slett
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RequestsPage;
