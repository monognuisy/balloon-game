import React from 'react';
import styled from 'styled-components';
import { Switch } from '@mui/material';

const Header = ({ toggleTheme }) => {
  return (
    <>
      <HeaderWrapper>
        <span>🌅 </span>
        <Switch onChange={() => toggleTheme((theme) => !theme)} />
        <span> 🌙</span>
      </HeaderWrapper>
    </>
  );
};

const HeaderWrapper = styled.header`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100px;
  padding: 20px;

  & > span {
    font-size: 1.5rem;
  }
`;

export default Header;
