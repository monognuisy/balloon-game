import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import styled from 'styled-components';
import './App.css';
import Grid from './components/Grid';

function App() {
  const [height, setHeight] = useState(5);
  const [width, setWidth] = useState(5);

  return (
    <>
      <input
        placeholder="height"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />
      <input
        placeholder="width"
        value={width}
        onChange={(e) => setWidth(e.target.value)}
      />
      {/* <Grid height={height} width={width} /> */}
      <Grid height={10} width={10} />
    </>
  );
}

export default App;
