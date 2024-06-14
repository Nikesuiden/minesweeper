import { use, useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [sampleVal, setSampleVal] = useState(0);
  const [faceBotton, setFaceBotton] = useState(0);
  const [bombMap, setBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  console.log(sampleVal);

  return (
    <div className={styles.container}>
      <div className={styles.selectMode} />
      <div className={styles.topContainer}>
        <div className={styles.flagCounter} />
        <div className={styles.resetBotton} style={{ backgroundPosition: `-330px 0` }} />
        <div className={styles.timeCounter} />
      </div>
      <div className={styles.boardstyle}>
        {bombMap.map(
          (
            row,
            y, //map = for
          ) =>
            row.map(
              (
                color,
                x, //row
              ) => (
                <div
                  className={styles.cellstyle}
                  key={`${x}-${y}`}
                  onClick={() => clickHandler(x, y)}
                >
                  {color !== 0 && (
                    <div
                      className={styles.stoneStyle}
                      style={{ background: color === 1 ? '#000' : '#fff' }}
                    />
                  )}
                </div>
              ),
            ),
        )}
      </div>
    </div>
  );
};

export default Home;
