import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [faceBotton, setFaceBotton] = useState(0); /* ゲーム状況を可視化 */
  const [userInput, setUserInput] = useState(0); /* ユーザのクリックしたとこ掘る */
  const [cellState, setCellState] = useState(0); /* セルのデザインを変化 */
  const [clickCounter, setClickCounter] = useState(0); /* クリック回数可視化 */
  const [bompCounter, setBombCounter] = useState(0);
  const [bombMap, setBombMap] = useState([
    /* 0がボムなし、1がボムあり */
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

  const directions = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ];

  function getRandomValue(value1: number, value2: number, probability: number): number {
    // 0 から 1 の間のランダムな数を生成
    const random = Math.random();

    // 確率に基づいて value1 か value2 を返す
    return random < probability ? value1 : value2;
  }

  /* 列数の定義 */
  const rowLength = bombMap[0];

  let click = 0;

  const clickHandler = (x: number, y: number) => {
    console.log(`クリックした座標 [x, y] => [${x}, ${y}]`);
    const newBompMap = structuredClone(bombMap);
    const newCountMap = structuredClone(bombMap);

    console.log(clickCounter);

    click += 1;
    setClickCounter(click)

    console.log(clickCounter);

    // setClickCounter(click)
    // console.log(clickCounter);

    /* 最初のクリックの処理 */
    if (clickCounter === 0) {

      /* クリック後マップにボムを配置 [m, n] */
      for (let n = 0; n < bombMap.length; n++) {
        for (let m = 0; m < rowLength.length; m++) {

          /* もし配置先がファーストクリックしたセルなら */
          if (n === y && m === x) {
            newBompMap[n][m] = 0;

          } else {
            newBompMap[n][m] = getRandomValue(0, 1, 0.9);
          }
          setBombMap(newBompMap);
        }
      }
    }

/* クリック2回以降 */
    else {

/* 全セル参照 */
    for (let n = 0; n < bombMap.length; n++)
      { for (let m = 0; m < rowLength.length; m++)

    {

    /* 一つのセルのまわりを詮索 */
    for (const dir of directions) {
      /* 未定義の領域を省くためのフィルターにかける */
      if (bombMap[n + dir[0]] !== undefined && bombMap[n + dir[0]][m + dir[1]] !== undefined) {

      /* 各セルに周辺にあるボムの数をカウントする */
      if (bombMap[n + dir[0]][m + dir[1]] === 1) {
        newCountMap[n][m] += 1;

      }

      }
    }
  }}

    setBombCounter(newCountMap);
  }
  };


  return (
    <div className={styles.container}>
      <div className={styles.selectMode}>
        <div className={styles.gameContainer}>
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
                    bomp,
                    x, //row
                  ) => (
                    <div
                      className={styles.cellstyle}
                      key={`${x}-${y}`}
                      onClick={() => clickHandler(x, y)}
                    > {cellState === 1 && (
                      <div
                        className={styles.bombStyle}
                        style={{ backgroundPosition: bomp === 1 ? `-300px 0` : `100px 0` }}
                      />
                      )}

                      {cellState === 0 && (
                        <div
                        className={styles.countStyle}
                        style={{backgroundPosition: }}/>
                      )}
                    </div>
                  ),
                ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
