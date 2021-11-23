import styled from "styled-components";

export const CardWrapper = styled.div`
  width: 200px;
  height: 40px;
  border-radius: 10px;
  background: #11998e;
  font-size: 20px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  margin-bottom: 20px;
  padding-top: 6px;

  &:hover {
    color: #11998e;
    font-weight: bold;
    background: #fff;
    border: 1px solid #11998e;
  }
`;

export const InputWrapper = styled.input`
  height: 40px;
  border 3px solid #c31432;
  width: 250px;
  border-radius: 10px;
  padding-left: 10px;
  color: #c31432;
  font-size: 18px;
  font-weight: 700;

  &::placeholder {
    color: #c31432;
  }
`;

export const ButtonWrapper = styled.button`
  min-width: 100px;
  height: 50px;
  background: transparent;
  border: none;
  border-radius: 5px;
  transition: 0.3s;
  cursor: pointer;
  margin-top: 20px;
  -webkit-text-fill-color: white;
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: #c31432;
  font-size: 30px;

  &:hover {
    border: 2px solid #c31432;
  }
`;
