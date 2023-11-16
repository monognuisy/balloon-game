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
      {/* <p>{num}</p> */}
      <BalloonImg alt={'red balloon'} src={redBalloonImg} />
    </BalloonDiv>
  );
};

export const Grid = () => {
  const location = useLocation();
  const h = location.state?.h;
  const w = location.state?.w;

  const [height, setHeight] = useState(h ? Number(h) : 5);
  const [width, setWidth] = useState(w ? Number(w) : 5);
  const [realMap, setRealMap] = useState([]);
  const [balloons, setBalloons] = useState({});
  const [isFailed, setIsFailed] = useState(false);
  const [isWin, setIsWin] = useState(false);

  const calc2dCoord = (i, j) => {
    return i * width + j;
  };
  const calc1dCoord = (i) => {
    const quotient = Math.floor(i / width);
    const remainder = i % width;
    return [quotient, remainder];
  };

  const find = (x, parent) => {
    if (parent[x] === x) return x;

    const currentParent = find(parent[x], parent);
    parent[x] = currentParent;

    return currentParent;
  };

  const union = (a, b, parent) => {
    const rootA = find(a, parent);
    const rootB = find(b, parent);

    if (rootA < rootB) parent[rootB] = rootA;
    else parent[rootA] = rootB;
  };

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

        balloonMap[i][j] = parent[balloonMap[i][j]];
      });
    });
  };

  const popBalloons = (num) => {
    const sortedNumberOfBalloons = Object.values(balloons)
      .map((arr) => arr.length)
      .toSorted((a, b) => b - a);

    if (sortedNumberOfBalloons[0] !== balloons[`${num}`].length) {
      console.log('fail');
      setIsFailed(true);
      return;
    }

    const newRealMap = [...realMap];
    balloons[num].forEach((idx) => {
      const [i, j] = calc1dCoord(idx);
      newRealMap[i][j] = 0;
    });

    setRealMap(newRealMap);

    const newBalloons = { ...balloons };
    delete newBalloons[`${num}`];

    setBalloons(newBalloons);
    console.log('success');

    if (Object.keys(newBalloons).length === 0) {
      setIsWin(true);
    }
  };

  const showGuide = (num) => {
    balloons[num].forEach((idx) => {});
  };

  // create Balloon, Blank map
  useEffect(() => {
    const balloonMap = [
      [...Array(width + 2).fill(0)],
      ...Array(height)
        .fill(0)
        .map(() => [...Array(width + 2).fill(0)]),
      [...Array(width + 2).fill(0)],
    ];
    const parent = [0];

    let k = 1;
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

    const iRange = [...Array(height).keys()].map((i) => i + 1);
    const jRange = [...Array(width).keys()].map((i) => i + 1);

    unionFind(iRange, jRange, balloonMap, parent);
    unionFind(iRange, [...jRange].reverse(), balloonMap, parent);
    unionFind([...iRange].reverse(), jRange, balloonMap, parent);
    unionFind([...iRange].reverse(), [...jRange].reverse(), balloonMap, parent);

    const newBalloons = {};

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

    setRealMap(
      balloonMap.slice(1, height + 1).map((a) => a.slice(1, width + 1)),
    );
    setBalloons(newBalloons);
  }, [height, width]);

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
