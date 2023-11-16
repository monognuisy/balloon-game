export const ButtonStyle = `
  width: 150px;
  height: 50px;
  display: flex;
  align-items: center;
  margin: 0 auto;
  border-radius: 10px;
  border: none;
  background-color: #aaaaaa;
  color: #242424;
  text-decoration: none;
  transition: all 0.3s;
  & > h3 {
    margin: 0 auto;
  }

  &:hover {
    background-color: #eeeeee;
  }
`;

export const PopupStyle = `
  width: 500px;
  height: 300px;
  background-color: #eeeeee;
  color: #333333;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 auto;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;

  > div {
    margin-bottom: 0;
    > h1 {
      margin: 0;
    }
    > h3 {
      font-size: 1.5rem;
    }
  }
`;

export const transparentWrapper = `
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(1, 1, 1, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;
