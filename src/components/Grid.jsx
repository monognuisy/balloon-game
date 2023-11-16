import { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import redBalloonImg from '../assets/red_balloon.png';
import { Link, useLocation } from 'react-router-dom';
import { PopupStyle, transparentWrapper } from '../Theme';

const Blank = () => {
  return <BlankDiv></BlankDiv>;
};

const Balloon = ({ num, popBalloons }) => {
  return (
    <BalloonDiv onClick={() => popBalloons(num)}>
      <BalloonImg alt={'red balloon'} src={redBalloonImg} />
    </BalloonDiv>
  );
};

// Main grid.
export const Grid = () => {
  const location = useLocation();
  const h = location.state?.h;
  const w = location.state?.w;

  const [height, setHeight] = useState(h ? Number(h) : 5);
  const [width, setWidth] = useState(w ? Number(w) : 5);
  const [realMap, setRealMap] = useState([]); // map indicating balloons in grid.
  const [balloons, setBalloons] = useState({}); // collection of balloons. key is the representative of balloons.
  const [isFailed, setIsFailed] = useState(false);
  const [isWin, setIsWin] = useState(false);

  // Calculate 2d coordinate to 1d coordinate.
  const calc2dCoord = (i, j) => {
    return i * width + j;
  };
  // Calculate 1d coordinate to 2d coordinate.
  const calc1dCoord = (i) => {
    const quotient = Math.floor(i / width);
    const remainder = i % width;
    return [quotient, remainder];
  };

  // Find and set (path compression) parent node.
  const find = (x, parent) => {
    if (parent[x] === x) return x;

    const currentParent = find(parent[x], parent);
    parent[x] = currentParent; // path compression

    return currentParent;
  };

  // Merge two trees.
  const union = (a, b, parent) => {
    const rootA = find(a, parent);
    const rootB = find(b, parent);

    if (rootA < rootB) parent[rootB] = rootA;
    else parent[rootA] = rootB;
  };

  // Apply union-find to group adjacent balloons.
  // Scan 4-ways. (left, right, up, down)
  const unionFind = (iRange, jRange, balloonMap, parent) => {
    iRange.forEach((i) => {
      jRange.forEach((j) => {
        if (!balloonMap[i][j]) return;

        if (balloonMap[i - 1][j]) {
          union(balloonMap[i][j], balloonMap[i - 1][j], parent);
        }
        if (balloonMap[i][j - 1]) {
          union(balloonMap[i][j], balloonMap[i][j - 1], parent);
        }
        if (balloonMap[i + 1][j]) {
          union(balloonMap[i + 1][j], balloonMap[i + 1][j], parent);
        }
        if (balloonMap[i - 1][j]) {
          union(balloonMap[i][j + 1], balloonMap[i][j + 1], parent);
        }

        // Also update balloonMap for faster union-find later.
        balloonMap[i][j] = parent[balloonMap[i][j]];
      });
    });
  };

  // Pop all adjacent balloons.
  // If selected group of balloons isn't the biggest, then setIsFailed(true).
  // If popped all balloons properly, then setIsWin(true).
  const popBalloons = (num) => {
    // Find size of the biggest balloons' group.
    const sortedNumberOfBalloons = Object.values(balloons)
      .map((arr) => arr.length)
      .toSorted((a, b) => b - a);

    if (sortedNumberOfBalloons[0] !== balloons[`${num}`].length) {
      console.log('fail');
      setIsFailed(true);
      return;
    }

    // Mark popped balloons as blank.
    const newRealMap = [...realMap];
    balloons[num].forEach((idx) => {
      const [i, j] = calc1dCoord(idx);
      newRealMap[i][j] = 0;
    });

    setRealMap(newRealMap);

    // Delete selected balloons' group.
    const newBalloons = { ...balloons };
    delete newBalloons[`${num}`];

    setBalloons(newBalloons);
    console.log('success');

    if (Object.keys(newBalloons).length === 0) {
      setIsWin(true);
    }
  };

  useEffect(() => {
    // Map with border. (to reduce checking out-of-bound index in union-find)
    // Border is same as 'blank'.
    const balloonMap = [
      [...Array(width + 2).fill(0)],
      ...Array(height)
        .fill(0)
        .map(() => [...Array(width + 2).fill(0)]),
      [...Array(width + 2).fill(0)],
    ];
    const parent = [0]; // parent(representative) node of each balloons.

    let k = 1; // balloon number.
    for (let i = 1; i <= height; i++) {
      for (let j = 1; j <= width; j++) {
        const isBalloon = Math.random() > 0.5;

        if (!isBalloon) {
          balloonMap[i][j] = 0;
          continue;
        }

        balloonMap[i][j] = k;
        parent.push(k);
        k++;
      }
    }

    // Do union-find to groupify.
    const iRange = [...Array(height).keys()].map((i) => i + 1);
    const jRange = [...Array(width).keys()].map((i) => i + 1);

    unionFind(iRange, jRange, balloonMap, parent);
    unionFind(iRange, [...jRange].reverse(), balloonMap, parent);
    unionFind([...iRange].reverse(), jRange, balloonMap, parent);
    unionFind([...iRange].reverse(), [...jRange].reverse(), balloonMap, parent);

    const newBalloons = {};

    // Build collection of balloons.
    // This collection has position(1d) of balloons for realMap.
    iRange.forEach((i) => {
      jRange.forEach((j) => {
        const num = balloonMap[i][j];
        if (!num) return;

        if (!(num in newBalloons)) {
          newBalloons[`${num}`] = [];
        }
        newBalloons[`${num}`].push(calc2dCoord(i - 1, j - 1));
      });
    });

    // Save without border. (height * width size)
    setRealMap(
      balloonMap.slice(1, height + 1).map((a) => a.slice(1, width + 1)),
    );
    setBalloons(newBalloons);
  }, [height, width]);

  // Build map of components from realMap.
  const cells = []
    .concat(...realMap)
    .map((n, index) =>
      n ? (
        <Balloon num={n} popBalloons={popBalloons} key={index} />
      ) : (
        <Blank key={index} />
      ),
    );

  return (
    <>
      <GridMain height={height} width={width}>
        {cells}
      </GridMain>
      {isFailed ? <FailView handleFailed={setIsFailed} /> : <></>}
      {isWin ? <SuccessView handleWin={setIsWin} /> : <></>}
    </>
  );
};

const PopupView = ({ title, message, handleFunc }) => {
  return (
    <>
      <FailWrapper>
        <FailPopup>
          <div>
            <h1>{title}</h1>
            <p>{message}</p>
          </div>
          <RetryButton onClick={() => handleFunc(false)} to="/">
            <h3>Retry</h3>
          </RetryButton>
        </FailPopup>
      </FailWrapper>
    </>
  );
};

const FailView = ({ handleFailed }) => {
  return (
    <>
      <PopupView
        title={`패배😭`}
        message={`이런! 잘못된 풍선을 터뜨렸네요.`}
        handleFunc={handleFailed}
      />
    </>
  );
};

const SuccessView = ({ handleWin }) => {
  return (
    <>
      <PopupView
        title={`승리😃`}
        message={`와우! 클리어 하셨습니다~🎉🎉`}
        handleFunc={handleWin}
      />
    </>
  );
};

const BlankDiv = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid;
`;
const BalloonDiv = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid;
  cursor: pointer;
`;
const BalloonImg = styled.img`
  width: 90%;
  height: 90%;
  object-fit: contain;
  padding: 5%;
  margin: 0 auto;
`;

const gridWidth = 700;
const gridHeight = 700;

const GridMain = styled.div`
  display: grid;
  width: ${gridWidth}px;
  height: ${gridHeight}px;
  grid-template-columns: repeat(
    ${({ width }) => width},
    ${({ width }) => gridWidth / width}px
  );
  grid-template-rows: repeat(
    ${({ height }) => height},
    ${({ height }) => gridHeight / height}px
  );
`;

const FailWrapper = styled.div`
  ${transparentWrapper}
`;

const FailPopup = styled.div`
  ${PopupStyle}
`;

const RetryButton = styled(Link)`
  width: 30%;
  height: 50px;
  bottom: 0;
  border-radius: 10px;
  border: 0;
  margin: 0 auto;
  cursor: pointer;
  background-color: #242424;
  transition: all 0.3s;

  color: #ffffff;
  text-decoration: none;

  display: flex;
  align-items: center;

  & > h3 {
    margin: 0 auto;
  }

  &:hover {
    background-color: #444444;
  }
`;
