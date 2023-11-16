import React from 'react';
import styled from 'styled-components';

const Header = ({ toggleTheme }) => {
  return (
    <>
      <HeaderWrapper>
        <button onClick={() => toggleTheme((theme) => !theme)}>Toggle!</button>
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
`;

export default Header;
