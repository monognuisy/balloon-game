import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ButtonStyle, PopupStyle, transparentWrapper } from '../Theme';

export const Startview = () => {
  const handleStart = () => {};

  return (
    <>
      <h1>Balloon Game🎈</h1>
      <div>
        <p>
          풍선을 클릭하면 터지게 되고, 상하좌우로 연결된 경우 같이 터지게
          됩니다.
        </p>
        <p>
          한번에 가장 많은 풍선을 터뜨릴 수 있는 순서대로 풍선을 클릭해야
          합니다.
        </p>
        <p>모든 풍선을 터뜨리면 성공, 잘못된 순서로 터뜨리면 실패입니다.</p>
      </div>
      <SettingWrapper>
        <InputWrapper>
          <input placeholder="행 개수" />
          <input placeholder="열 개수" />
        </InputWrapper>
        <StartLink onClick={handleStart} to="/play">
          <h3>Game Start!</h3>
        </StartLink>
      </SettingWrapper>
    </>
  );
};

const SettingWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 10px;
  align-items: center;
  border-radius: 10px;
  border: 1px solid #444444;
  padding: 10px;
  padding-left: 0;
`;

const InputWrapper = styled.div`
  display: flex;
  & input {
    padding: 10px;
    margin: 0 10px;
  }
`;

const StartLink = styled(Link)`
  ${ButtonStyle}
`;
