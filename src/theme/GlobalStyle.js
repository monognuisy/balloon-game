import { createGlobalStyle } from 'styled-components';
import '../fonts/FontStyle.css';

const GlobalStyle = createGlobalStyle`
  :root {
    font-family: Pretendard, 'Pretendard Variable', Inter, system-ui, Avenir, Helvetica, Arial, sans-serif; 
    line-height: 1.5;
    font-weight: 400;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  body {
    background-color: ${({ theme }) => theme.backgroundColor};
    color: ${({ theme }) => theme.textColor};
    margin: 0;
    display: flex;
    place-items: center;
    min-width: 320px;
    min-height: 100vh;
  }

  h1 {
    font-size: 3rem;
  }

  #root {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }
  
`;

export default GlobalStyle;
