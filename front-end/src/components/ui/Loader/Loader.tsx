import React from "react";
import styled from "styled-components";

const ModalWrapper = styled.div`
  justify-content: center;
  align-items: center;
  display: ${(props: { isLoading: boolean }) =>
    props.isLoading ? "flex" : "none" };
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Spinner = styled.div`
  border: 10px solid #f3f3f3; /* Light grey */
  border-top: 10px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const Loader = (props: {isLoading: boolean}) => {
  return (
    <ModalWrapper isLoading={props.isLoading}>
        <Spinner />
    </ModalWrapper>
  );
};
