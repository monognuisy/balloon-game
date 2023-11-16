import { useState } from 'react';
import styled from 'styled-components';
import './App.css';
import { Grid } from './components/Grid';
import { Startview } from './components/Ready';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [height, setHeight] = useState(5);
  const [width, setWidth] = useState(5);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Startview />}></Route>
          <Route path="/play" element={<Grid />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
