import { useEffect, useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [clickState, setClickState] = useState([
    // 0:空、1:クリック済み、2:🚩、岩などが0に当たる
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

  const [bombMap, setBombMap] = useState([
    // 0がボムなし、1がボムあり、以降周辺のボム数2~10:0~8
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

  const [time, setTime] = useState(0); // タイムの状態を追加
  const [isStarted, setIsStarted] = useState(false); // タイマー開始判定

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isStarted && time < 999) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime < 999) {
            return prevTime + 1;
          } else {
            clearInterval(timer);
            return prevTime;
          }
        });
      }, 1000); // 1秒ごとにカウントアップ
    }

    // コンポーネントがアンマウントされたときにタイマーをクリア
    return () => clearInterval(timer);
  }, [isStarted, time]);

  const rowLength = bombMap[0];
  const newBompMap = structuredClone(bombMap);
  const newClickMap = structuredClone(clickState);

  let bombCounter = 2; // デフォルト１だとボムに変化する可能性があるため

  // 呼び出し関数として blank を定義
  const blank = (x: number, y: number) => {
    // クリックしたセルのボムカウントが0だった場合、周辺8方向のセルもクリック済みにする
    console.log(`クリックセルの周辺ボム数${newBompMap[x][y]}`);
    if (newBompMap[x][y] === 0) {
      for (const dir of directions) {
        // もし周辺セルが範囲外ではなかった場合
        if (
          newBompMap[x + dir[0]] !== undefined &&
          newBompMap[x + dir[0]][y + dir[1]] !== undefined
        ) {
          // クリック済みにする
          newClickMap[x + dir[0]][y + dir[1]] = 1;
        }
      }
    }
  };

  const clickHandler = (x: number, y: number) => {
    console.log(`クリックした座標 [x, y] => [${x}, ${y}]`);

    // 二次元配列を一次元化する配列
    const oneDimArray: number[] = newClickMap.flat(1);
    // フラット化された関数から "1" の値をカウントする
    const countOfValue = oneDimArray.filter((item) => item === 1).length;

    // もしファーストクリックだったら
    if (countOfValue === 0) {
      // ファーストクリックでタイマー開始
      setIsStarted(true);

      newBompMap[x][y] = 0;

      // マップ上全展開、残りのセルに爆弾を設置
      let onesPlaced = 0;
      const totalOnes = 10; // 配置する1の数
      const totalCells = bombMap.length * rowLength.length;

      // 全セルを一時的にフラットなリストとして扱う
      const flatMap = [];

      // まず全てのセルをランダムに 0 または 1 とする
      for (let i = 0; i < totalCells; i++) {
        if (onesPlaced < totalOnes) {
          flatMap.push(1);
          onesPlaced++;
        } else {
          flatMap.push(0);
        }
      }

      // マップ内の１の数が totalOnes と一致するまで繰り返す
      while (true) {
        // フラットなリストをシャッフルする
        for (let i = flatMap.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [flatMap[i], flatMap[j]] = [flatMap[j], flatMap[i]];
        }

        // シャッフルされたリストを新しい bombMap に適用
        let index = 0;
        for (let n = 0; n < bombMap.length; n++) {
          for (let m = 0; m < rowLength.length; m++) {
            newBompMap[n][m] = flatMap[index++];
          }
        }

        // クリックした場所はボムなしにする。
        if (newBompMap[x][y] === 1) {
          newBompMap[x][y] = 0;
        }

        const newBombArray: number[] = newBompMap.flat(1);
        const countNewOne = newBombArray.filter((item) => item === 1).length;

        if (countNewOne === totalOnes) {
          console.log(`ボムの数${countNewOne}`);
          break;
        }
      }

      // セルが空白の場合、周辺のボム数を計測
      for (let n = 0; n < bombMap.length; n++) {
        for (let m = 0; m < rowLength.length; m++) {
          if (newBompMap[n][m] === 0) {
            for (const dir of directions) {
              if (
                newBompMap[n + dir[0]] !== undefined &&
                newBompMap[n + dir[0]][m + dir[1]] !== undefined &&
                newBompMap[n + dir[0]][m + dir[1]] === 1
              ) {
                bombCounter += 1;
              }
            }
            newBompMap[n][m] = bombCounter;
            bombCounter = 2;
          }
        }
      }
    }

    // クリックしたところはクリック済みの "1" 印を設置
    newClickMap[x][y] = 1;

    // 空白セルの周囲を探索


    // 二次元配列を一次元化する配列
    const oneDimArray2: number[] = newClickMap.flat(1);
    // フラット化された関数から "1" の値をカウントする
    const countOfValue2 = oneDimArray2.filter((item) => item === 1).length;

    const seeNewBompMap = [];

    for (let n = 0; n < bombMap.length; n++) {
      for (let m = 0; m < rowLength.length; m++) {
        if (newBompMap[n][m] >= 2) {
          seeNewBompMap.push(newBompMap[n][m] - 2);
        } else if (newBompMap[n][m] === 1) {
          seeNewBompMap.push("b");
        }
      }
    }

    blank(x, y);

    console.log(`アメリカの${seeNewBompMap}, 計${seeNewBompMap.length}`);

    console.log(oneDimArray2);
    console.log(countOfValue2);
    setBombMap(newBompMap);
    setClickState(newClickMap);
  };

  return (
    <div className={styles.container}>
      <div className={styles.selectMode}>初級 中級 上級 カスタム</div>
      <div className={styles.gameContainer}>
        <div className={styles.topContainer}>
          <div className={styles.flagCounter} />
          <div className={styles.resetBotton} style={{ backgroundPosition: `-330px 0` }} />
          <div className={styles.timeCounter}>{time.toString().padStart(3, '0')}</div>
        </div>
        <div className={styles.boardstyle}>
          {bombMap.map((row, y) =>
            row.map((bomb, x) => {
              const clickValue = clickState[x][y]; // clickState から現在のセルの状態を取得
              return (
                <div
                  className={styles.cellstyle}
                  key={`${x}-${y}`}
                  onClick={() => clickHandler(x, y)}
                >
                  {/* クリックされていない場合 */}
                  {clickValue === 0 && <div className={styles.coverstyle} />}

                  {/* クリックされている場合 */}
                  {clickValue === 1 && (
                    <>
                      {bomb === 1 && (
                        <div
                          className={styles.bombStyle}
                          style={{ backgroundPosition: `-300px 0` }}
                        />
                      )}
                      {bomb >= 3 && (
                        <div
                          className={styles.countStyle}
                          style={{ backgroundPosition: `${-30 * (bomb - 3)}px 0` }}
                        />
                      )}
                      {/* ボムがなく、周りにボムもない場合 */}
                      {bomb === 0 && <div className={styles.emptyCell} />}
                    </>
                  )}

                  {/* フラグが立っている場合 */}
                  {clickValue === 2 && (
                    <div className={styles.countStyle} style={{ backgroundPosition: `-270px 0` }} />
                  )}
                </div>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
