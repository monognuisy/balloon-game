import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import styled from 'styled-components';
import './App.css';
import { Grid, Failview } from './components/Grid';
import { Startview } from './components/Ready';

function App() {
  const [height, setHeight] = useState(5);
  const [width, setWidth] = useState(5);
  const [isFailed, setIsFailed] = useState(false);

  return (
    <>
      <Grid height={10} width={10} handleFailed={setIsFailed} />
      {isFailed ? <Failview handleFailed={setIsFailed} /> : <></>}
    </>
  );
}

export default App;
