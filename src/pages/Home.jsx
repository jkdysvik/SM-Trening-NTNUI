import WaterLevelForecast from '../components/WaterLevelForecast';
import styles from './stylesheets/Home.module.css';
function Home() {
  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <WaterLevelForecast/>
      </header>
    </div>
  );
}

export default Home;