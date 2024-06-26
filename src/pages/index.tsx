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

  const [LeftBomb, setLeftBomb] = useState(0);
  const [LeftCell, setLeftCell] = useState(0);

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

  // 0: ゲーム中, 1: ゲームクリア, 2: ゲームオーバー
  // => クリック可能状態ににも兼用
  const [face, setFace] = useState(0);

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
  const [timeIsStarted, setTimeIsStarted] = useState(false); // タイマー開始判定

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (timeIsStarted && time < 999) {
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
  }, [timeIsStarted, time]);

  const rowLength = bombMap[0];
  const newBompMap = structuredClone(bombMap);
  const newClickMap = structuredClone(clickState);


  // 左右クリック識別
  const handleCellClick = (e: React.MouseEvent<HTMLDivElement>, x: number, y: number) => {
    e.preventDefault(); // 右クリックのデフォルト動作（コンテキストメニューの表示）を防止

    switch (e.button) {
      case 0:
        // 左クリックの処理
        console.log(`左クリック - 座標 [x, y] => [${x}, ${y}]`);
        leftClickHandler(x, y);
        break;
      case 2:
        // 右クリックの処理
        console.log(`右クリック - 座標 [x, y] => [${x}, ${y}]`);
        rightClickHandler(x, y);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const newBompMap = structuredClone(bombMap);
    const newClickMap = structuredClone(clickState);
    // マップ内のボムの数をカウントする
    const BombMapArray: number[] = newBompMap.flat(1);
    setLeftBomb(BombMapArray.filter((item) => item === 1).length);

    // マップ内の余ったセルをカウントする
    const ClickMapArray: number[] = newClickMap.flat(1);
    setLeftCell(ClickMapArray.filter((item) => item === 0 || item === 2).length);
  }, [bombMap, clickState]);

  // 右クリック処理
  const rightClickHandler = (x: number, y: number) => {
    console.log(`右クリックしたセル${[x, y]}`);

    if (face === 0) {
      // クリックセルが岩だったら旗を立てられる
      if (newClickMap[x][y] === 0) {
        newClickMap[x][y] = 2;
      }
      // クリックセルに旗が立っていたら
      else if (newClickMap[x][y] === 2) {
        newClickMap[x][y] = 0;
      }

      console.log(`LeftBomb: ${LeftBomb}`);
      console.log(`LeftCell: ${LeftCell}`);

      // ボムと🚩の合同セルの数と、合計🚩数が一致したらクリア
      if (LeftBomb === LeftCell) {
        setFace(1);
        setTimeIsStarted(false);
      }
    }

    setClickState(newClickMap); // 修正: setClickState のみを呼び出す
  };

  const blank = (x: number, y: number) => {
    // クリックした箇所の周辺ボム数が0すなわち newBompMap[x][y] === 2 である場合
    if (newBompMap[y][x] === 2) {
      // クリックセルの周りをクリック済みにする
      for (const dir of directions) {
        if (
          newBompMap[x + dir[0]] !== undefined &&
          newBompMap[x + dir[0]][y + dir[1]] !== undefined &&
          newClickMap[x + dir[0]][y + dir[1]] === 0
        ) {
          newClickMap[x + dir[0]][y + dir[1]] = 1;

          // もしとなりも周辺ボム０だったら
          if (newBompMap[x + dir[0]][y + dir[1]] === 2) {
            blank(x + dir[0], y + dir[1]);
          }
        }
      }
    }
  };

  // 顔ボタンが押されたらボードをリセットする
  const resetBotton = () => {
    // タイム計測のリセット
    setTime(0);
    setTimeIsStarted(false);

    // 顔文字リセット
    setFace(0);

    for (let n = 0; n < bombMap.length; n++) {
      for (let m = 0; m < rowLength.length; m++) {
        newBompMap[n][m] = 0;
        newClickMap[n][m] = 0;
      }
    }
    setBombMap(newBompMap);
    setClickState(newClickMap);
  };

  const leftClickHandler = (x: number, y: number) => {
    console.log(`クリックした座標 [x, y] => [${x}, ${y}]`);

    let bombCounter = 2; // デフォルト１だとボムに変化する可能性があるため

    // 二次元配列を一次元化する配列
    const oneDimArray: number[] = newClickMap.flat(1);
    // フラット化された関数から "1" の値をカウントする
    const countOfValue = oneDimArray.filter((item) => item === 1).length;

    // フラッグ🚩があるセルには左クリック処理が不可
    // かつゲームクリアまたはオーバーを除く
    if (newClickMap[x][y] !== 2 && face === 0) {
      // もしファーストクリックだったら
      if (countOfValue === 0) {
        // ファーストクリックでタイマー開始
        setTimeIsStarted(true);

        newBompMap[y][x] = 0;

        // マップ上全展開、残りのセルに爆弾を設置
        let onesPlaced = 0;
        const totalOnes = 5; // 配置する1の数
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
          if (newBompMap[y][x] === 1) {
            newBompMap[y][x] = 0;
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
              console.log(`bombCounter: ${bombCounter - 2}`);
              bombCounter = 2;
            }
          }
        }
      }

      // もしボムをクリックしたら
      if (newBompMap[y][x] === 1) {
        console.log('ゲームオーバー');
        for (let n = 0; n < bombMap.length; n++) {
          for (let m = 0; m < rowLength.length; m++) {
            // ボムセルをフィルタリング
            if (newBompMap[n][m] === 1) {
              console.log('通過確認');
              newClickMap[m][n] = 1;
            }
          }
        }
        setFace(2);
        setTimeIsStarted(false);
      }

      if (newBompMap[y][x] >= 2) {
        console.log(`ここなに！！！！：${newBompMap[y][x] - 2}`);
      } else if (newBompMap[y][x] === 1) {
        console.log(`ここなに!!!!!: b`);
      }
      // クリックしたところはクリック済みの "1" 印を設置
      newClickMap[x][y] = 1;

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
            seeNewBompMap.push('b');
          }
        }
      }

      blank(x, y);





      // ポイント２
      console.log(`アメリカの${seeNewBompMap}, 計${seeNewBompMap.length}`);

      console.log(oneDimArray2);
      console.log(countOfValue2);
      setBombMap(newBompMap);
      setClickState(newClickMap);

      console.log(`LeftBomb: ${LeftBomb}`);
      console.log(`LeftCell: ${LeftCell}`);

      // ボムと🚩の合同セルの数と、合計🚩数が一致したらクリア
      if (LeftBomb === LeftCell) {
        setFace(1);
        setTimeIsStarted(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.selectMode}>初級 中級 上級 カスタム</div>
      <div className={styles.gameContainer}>
        <div className={styles.topContainer}>
          <div className={styles.flagCounter} />
          {face === 0 && (
            <div
              className={styles.resetBotton}
              style={{ backgroundPosition: `-330px 0` }}
              onClick={resetBotton}
            />
          )}
          {face === 1 && (
            <div
              className={styles.resetBotton}
              style={{ backgroundPosition: `-360px 0` }}
              onClick={resetBotton}
            />
          )}
          {face === 2 && (
            <div
              className={styles.resetBotton}
              style={{ backgroundPosition: `-390px 0` }}
              onClick={resetBotton}
            />
          )}
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
                  onClick={(e) => handleCellClick(e, x, y)}
                  onContextMenu={(e) => handleCellClick(e, x, y)} // 右クリック時の処理とコンテキストメニューの防止
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
                    <>
                      <div className={styles.coverstyle} />
                      <div
                        className={styles.flagStyle}
                        style={{ backgroundPosition: `-270px 0` }}
                      />
                    </>
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
