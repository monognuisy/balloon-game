import { useState } from 'react';
import styled from 'styled-components';
import { Grid } from './components/Grid';
import { Startview } from './components/Ready';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './theme/GlobalStyle';
import { darkTheme, lightTheme, theme } from './theme/Theme';

function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <>
      <Header toggleTheme={setIsDark} />
      <BrowserRouter>
        <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
          <GlobalStyle />
          <Routes>
            <Route path="/" element={<Startview />}></Route>
            <Route path="/play" element={<Grid />}></Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
