import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import styles from './stylesheets/AdminHomePage.module.css';

function AdminHomePage() {
  const [dayRequests, setDayRequests] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      setError(null);

      try {
        const q = query(collection(db, 'requests'), orderBy('date', 'asc'));
        const querySnapshot = await getDocs(q);

        const requestsByDate = {};

        querySnapshot.forEach((doc) => {
          const requestData = { id: doc.id, ...doc.data() };

          if (!requestsByDate[requestData.date]) {
            requestsByDate[requestData.date] = [];
          }

          requestsByDate[requestData.date].push(requestData);
        });

        setDayRequests(requestsByDate);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('Could not load requests.');
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  // ✅ Function to approve or reject a request
  const updateApprovalStatus = async (requestId, newStatus) => {
    try {
      await updateDoc(doc(db, 'requests', requestId), { approved: newStatus });
      setDayRequests((prevRequests) => {
        const updatedRequests = { ...prevRequests };
        Object.keys(updatedRequests).forEach((date) => {
          updatedRequests[date] = updatedRequests[date].map((req) =>
            req.id === requestId ? { ...req, approved: newStatus } : req
          );
        });
        return updatedRequests;
      });
    } catch (err) {
      console.error('Error updating request:', err);
      alert('Could not update request status. Try again.');
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h2 className={styles.adminTitle}>Admin Oversikt</h2>

      {loading && <p className={styles.loadingText}>Laster...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {!loading && Object.keys(dayRequests).length === 0 && (
        <p className={styles.noRequests}>Ingen forespørsler funnet.</p>
      )}

      {!loading && Object.keys(dayRequests).length > 0 && (
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Dato</th>
              <th>Starttid</th>
              <th>Slutttid</th>
              <th>Lag</th>
              <th>Status</th>
              <th>Handling</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(dayRequests).map((date) =>
              dayRequests[date].map((req) => (
                <tr key={req.id}>
                  <td>{req.date}</td>
                  <td>{req.startTime}</td>
                  <td>{req.endTime}</td>
                  <td>{req.team}</td>
                  <td className={
                    req.approved === "Venter" ? styles.pending :
                    req.approved === "Godkjent" ? styles.approved :
                    req.approved === "Avslått" ? styles.denied : ''
                  }>
                    {req.approved}
                  </td>
                  <td>
                    <button
                      className={styles.approveButton}
                      disabled={req.approved === 'Godkjent'}
                      onClick={() => updateApprovalStatus(req.id, 'Godkjent')}
                    >
                      Godkjenn
                    </button>
                    <button
                      className={styles.rejectButton}
                      disabled={req.approved === 'Avslått'}
                      onClick={() => updateApprovalStatus(req.id, 'Avslått')}
                    >
                      Avslå
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminHomePage;
