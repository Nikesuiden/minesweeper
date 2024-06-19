import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [faceBotton, setFaceBotton] = useState(0); /* ゲーム状況を可視化 */
  const [userInput, setUserInput] = useState(0); /* ユーザのクリックしたとこ掘る */
  const [cellState, setCellState] = useState(0); /* セルのデザインを変化 */
  const [clickState, setClickState] = useState([
    /* 0:空、1:クリック済み、2:🚩 */ [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const [bombMap, setBombMap] = useState([
    /* 0がボムなし、1がボムあり、以降周辺のボム数2~9:1~8 */
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

  const clickHandler = (x: number, y: number) => {
    console.log(`クリックした座標 [x, y] => [${x}, ${y}]`);
    const newBompMap = structuredClone(bombMap);
    const newClickMap = structuredClone(clickState);

    // 二次元配列を一次元化する配列
    const oneDimArray: number[] = newClickMap.flat(1);
    // フラット化された関数から "1" の値をカウントする
    const countOfValue = oneDimArray.filter((item) => item === 1).length;

    /* もしファーストクリックだったら */
    if (countOfValue === 0) {
      newBompMap[x][y] = 0;

    /* マップ上全展開、残りのセルに爆弾を設置 */
    for (let n = 0; n < bombMap.length; n++) {
      for (let m = 0; m < rowLength.length; m++) {
        newBompMap[n][m] = getRandomValue(0, 1, 0.9);
        }
    }

    /* セルが空白の場合、周辺のボム数を計測 */
    for (let n = 0; n < bombMap.length; n++) {
      for (let m = 0; m < rowLength.length; m++) {
        if (newBompMap[n][m] === 0) {
          for (const dir of directions) {
            if(newBompMap[n + dir[0]] !== undefined &&
              newBompMap[n + dir[0]][m + dir[1]] !== undefined &&
            newBompMap[n + dir[0]][m + dir[1]] === 1) {
              break;
              }

            }
          }
        }

        }
    }




    /* クリックしたところはクリック済みの"1"印を設置 */
    newClickMap[x][y] = 1;

    // 二次元配列を一次元化する配列
    const oneDimArray2: number[] = newClickMap.flat(1);
    // フラット化された関数から "1" の値をカウントする
    const countOfValue2 = oneDimArray2.filter((item) => item === 1).length;

    console.log(oneDimArray2);
    console.log(countOfValue2);
    setBombMap(newBompMap);
    setClickState(newClickMap);
  };

  return (
    <div className={styles.container}>
      <div className={styles.selectMode}>
        初級 中級 上級 カスタム
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
                    bomb,
                    x, //row
                  ) => (
                    <div
                      className={styles.cellstyle}
                      key={`${x}-${y}`}
                      onClick={() => clickHandler(x, y)}
                    >
                      {bomb === 1 && (
                        <div
                          className={styles.bombStyle}
                          style={{ backgroundPosition: bomb === 1 ? `-300px 0` : `100px 0` }}
                        />
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
