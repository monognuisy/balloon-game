import { useState } from 'react';
import styled from 'styled-components';
import './App.css';
import { Grid, Failview } from './components/Grid';
import { Startview } from './components/Ready';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Startview />}></Route>
          <Route path="/play" element={<GridWrapper />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

const GridWrapper = () => {
  const [height, setHeight] = useState(5);
  const [width, setWidth] = useState(5);
  const [isFailed, setIsFailed] = useState(false);
  return (
    <>
      <Grid height={10} width={10} handleFailed={setIsFailed} />
      {isFailed ? <Failview handleFailed={setIsFailed} /> : <></>}
    </>
  );
};

export default App;
