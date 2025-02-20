import React, { useEffect, useState } from 'react';
import Request from './Request';
import styles from './stylesheets/WaterLevelForecast.module.css';

function NidelvaWaterLevel() {
  const [dayRanges, setDayRanges] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWaterLevels() {
      try {
        const now = new Date();
        const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
        const fromTime = now.toISOString().slice(0, 16);
        const toTime = twoWeeksLater.toISOString().slice(0, 16);

        const url = new URL('https://vannstand.kartverket.no/tideapi.php');
        url.searchParams.set('tide_request', 'locationdata');
        url.searchParams.set('lat', 63.425047);
        url.searchParams.set('lon', 10.400596);
        url.searchParams.set('fromtime', fromTime);
        url.searchParams.set('totime', toTime);
        url.searchParams.set('datatype', 'PRE');
        url.searchParams.set('refcode', 'CD');
        url.searchParams.set('interval', '10');
        url.searchParams.set('lang', 'en');
        url.searchParams.set('dst', '1');

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

        const errorTag = xmlDoc.querySelector('error');
        if (errorTag) throw new Error(errorTag.textContent || 'Unknown API error');

        const noDataTag = xmlDoc.querySelector('nodata');
        if (noDataTag) throw new Error(noDataTag.getAttribute('info') || 'No data available');

        const predictionNodes = xmlDoc.querySelectorAll('data[type="prediction"] waterlevel');
        const hourlyData = Array.from(predictionNodes).map((node) => ({
          rawTime: node.getAttribute('time'),
          value: Number(node.getAttribute('value')),
        }));

        const dayMap = {};
        for (const entry of hourlyData) {
          if (entry.value <= 200) continue;
          const dateObj = new Date(entry.rawTime);
          const dayString = dateObj.toLocaleDateString('en-CA', { timeZone: 'Europe/Oslo' });
          const timeString = dateObj.toLocaleTimeString('en-GB', {
            timeZone: 'Europe/Oslo',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
          });

          if (!dayMap[dayString]) dayMap[dayString] = [];
          dayMap[dayString].push(timeString);
        }

        const toMinutes = (hhmm) => {
          const [hh, mm] = hhmm.split(':').map(Number);
          return hh * 60 + mm;
        };

        const results = Object.keys(dayMap).sort().map((dayStr) => {
          const timesArray = dayMap[dayStr].sort();
          const ranges = [];
          let start = timesArray[0];
          let prevMins = toMinutes(start);

          for (let i = 1; i < timesArray.length; i++) {
            const current = timesArray[i];
            const currentMins = toMinutes(current);

            if (currentMins === prevMins + 10) {
              prevMins = currentMins;
            } else {
              ranges.push([start, timesArray[i - 1]]);
              start = current;
              prevMins = currentMins;
            }
          }
          if (start) ranges.push([start, timesArray[timesArray.length - 1]]);

          return { date: dayStr, ranges };
        });

        setDayRanges(results);
        setError(null);
      } catch (err) {
        setError(err.message);
        setDayRanges([]);
      }
    }

    fetchWaterLevels();
  }, []);

  return (
    <div className={styles.forecastContainer}>
      <h2 className={styles.forecastTitle}>Tidsvinduer</h2>
      {error && <div className={styles.errorMessage}>Error: {error}</div>}
      {!error && dayRanges.length === 0 && <p>Laster...</p>}

      {dayRanges.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Dato</th>
              <th>Tidspunkter</th>
              <th>Forespørsel</th>
            </tr>
          </thead>
          <tbody>
            {dayRanges.map((dayObj) => (
              <tr key={dayObj.date}>
                <td>{dayObj.date}</td>
                <td>
                  {dayObj.ranges.length === 0 ? 'None' : (
                    dayObj.ranges.map(([start, end], idx) => (
                      <div key={idx}>{start === end ? start : `${start} - ${end}`}</div>
                    ))
                  )}
                </td>
                <td>
                  <Request dateStr={dayObj.date} availableSlots={dayObj.ranges} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default NidelvaWaterLevel;
