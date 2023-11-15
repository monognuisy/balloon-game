import { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';

const Blank = () => {
  return <BlankDiv></BlankDiv>;
};

const Balloon = ({ num, pos, popBalloons }) => {
  return (
    <BalloonDiv onClick={() => popBalloons(num, pos)}>
      <p>{num}</p>
    </BalloonDiv>
  );
};

const Grid = ({ height, width }) => {
  const [realMap, setRealMap] = useState([]);
  const [balloons, setBalloons] = useState({});

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

  const popBalloons = (num, pos) => {
    const sortedNumberOfBalloons = Object.values(balloons)
      .map((arr) => arr.length)
      .toSorted((a, b) => b - a);

    if (sortedNumberOfBalloons[0] !== balloons[`${num}`].length) {
      console.log('fail');
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
  }, []);

  const cells = []
    .concat(...realMap)
    .map((n, index) =>
      n ? (
        <Balloon num={n} pos={index} popBalloons={popBalloons} key={index} />
      ) : (
        <Blank key={index} />
      ),
    );

  return (
    <>
      <GridMain height={height} width={width}>
        {cells}
      </GridMain>
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
`;
const GridMain = styled.div`
  display: grid;
  width: 500px;
  height: 500px;
  grid-template-columns: repeat(${(props) => props.width}, 1fr);
  grid-template-rows: repeat(${(props) => props.height}, 1fr);
`;

export default Grid;
