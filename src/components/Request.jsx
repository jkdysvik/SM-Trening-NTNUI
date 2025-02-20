import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import styles from './stylesheets/Request.module.css';

function Request({ dateStr, availableSlots }) {
  const { currentUser, userTeam } = useAuth();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [approved, setApproved] = useState("Venter");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);

  const toMinutes = (hhmm) => {
    const [hh, mm] = hhmm.split(':').map(Number);
    return hh * 60 + mm;
  };

  const isWithinAvailableSlot = (start, end) => {
    if (!availableSlots || availableSlots.length === 0) return false;
    const startMins = toMinutes(start);
    const endMins = toMinutes(end);

    return availableSlots.some(([slotStart, slotEnd]) => {
      const slotStartMins = toMinutes(slotStart);
      const slotEndMins = toMinutes(slotEnd);
      return startMins >= slotStartMins && endMins <= slotEndMins;
    });
  };

  const handleRequest = async () => {
    setError(null);
    setSuccess('');
    setShowModal(false);

    if (!currentUser) {
      setError('Du må logge inn for å gjøre en forespørsel.');
      setShowModal(true);
      return;
    }

    if (!startTime || !endTime) {
      setError('Vennligst velg et start og slutttidspunkt.');
      setShowModal(true);
      return;
    }

    if (!isWithinAvailableSlot(startTime, endTime)) {
      setError('Den valgte tiden er utenfor tidsrammen.');
      setShowModal(true);
      return;
    }

    try {
      await addDoc(collection(db, 'requests'), {
        userId: currentUser.uid,
        team: userTeam || 'Unknown Team',
        date: dateStr,
        startTime,
        endTime,
        approved,
        createdAt: serverTimestamp(),
      });
      setSuccess('Forespørsel sendt inn!');
      setStartTime('');
      setEndTime('');
      setShowModal(true);
    } catch (err) {
      setError(`Could not request slot: ${err.message}`);
      setShowModal(true);
    }
  };

  return (
    <div className={styles.requestForm}>
      <p>
        Fra:
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={styles.requestInput} />
        Til:
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={styles.requestInput} />
      </p>
      <button onClick={handleRequest} className={styles.requestButton}>Forespør</button>

      {/* ✅ Pop-Up Modal for Error/Success Messages */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>{error ? 'Feil' : 'Suksess'}</h3>
            <p>{error || success}</p>
            <button onClick={() => setShowModal(false)} className={styles.modalButton}>Lukk</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Request;
