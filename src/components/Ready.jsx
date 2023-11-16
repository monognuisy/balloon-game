import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ButtonStyle } from '../style/Style';

export const Startview = () => {
  // height, width of grids
  const height = useRef(0);
  const width = useRef(0);

  const navigate = useNavigate();

  const handleOnChange = (e, refval) => {
    refval.current = e.target.value;
  };

  // handle pressing 'Game Start!' button.
  const handleStart = () => {
    const h = height.current;
    const w = width.current;
    if (h <= 0 || w <= 0 || h > 40 || w > 40) {
      alert('각 값은 1 이상 40이하 여야 합니다.');
      return;
    }

    navigate('/play', {
      state: { h: `${height.current}`, w: `${width.current}` },
    });
  };

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
        <p>모든 풍선을 터뜨리면 승리, 잘못된 순서로 터뜨리면 패배합니다.</p>
      </div>
      <SettingWrapper>
        <InputWrapper>
          <input
            placeholder="행 개수"
            type="number"
            min={1}
            max={40}
            onChange={(e) => handleOnChange(e, height)}
          />
          <input
            placeholder="열 개수"
            type="number"
            min={1}
            max={40}
            onChange={(e) => handleOnChange(e, width)}
          />
        </InputWrapper>
        <StartButton onClick={() => handleStart()}>
          <h3>Game Start!</h3>
        </StartButton>
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
  border: 1px solid ${({ theme }) => theme.borderColor};
  padding: 10px;
  padding-left: 0;
`;

const InputWrapper = styled.div`
  display: flex;
  & input {
    width: 100px;
    padding: 10px;
    margin: 0 10px;
  }
`;

const StartButton = styled.button`
  ${ButtonStyle}
`;
