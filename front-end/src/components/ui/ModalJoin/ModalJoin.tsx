import React, { useState } from "react";
import { joinRoom } from "../../../utils/deejai";
import styled from "styled-components";

const ModalWrapper = styled.div`
  justify-content: center;
  align-items: center;
  display: ${(props: { hideModal: boolean }) =>
    props.hideModal ? "none" : "flex"};
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;
const ModalContainer = styled.div`
  width: 80%;
  height: 80%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.04),
    0px 0px 1px rgba(0, 0, 0, 0.04);
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const TitleContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: row;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;
const TitleText = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #70a9c7;
  margin-left: 1rem;
  margin-right: 1rem;
`;
const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;
const CloseIcon = styled.i`
  font-size: 1.5rem;
  color: #70a9c7;
  margin-right: 1rem;
`;

const CloseButton = styled.div`
  background: #ffffff;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 300;
  color: #70a9c7;
  margin-right: 1rem;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: #fafafa;
    color: #70a9c7;
  }
`;
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* margin-top: 1rem; */
  /* margin-bottom: 1rem; */
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 80%;
`;

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 80%;
`;

const DescriptionText = styled.p`
  font-size: 0.8rem;
  font-weight: 300;
  color: #70a9c7;
  margin-left: 1rem;
  margin-right: 1rem;
`;



const CreateButton = styled.div`
  background: #70a9c7;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 300;
  color: #fafafa;
  margin-right: 1rem;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: #70a9c7;
    color: #fafafa;
  }
`;

const CreateButtonText = styled.span`
  font-size: 0.8rem;
  font-weight: 300;
  color: #fafafa;
  margin-left: 1rem;
  margin-right: 1rem;
`;

export const ModalJoin = (props: {
  hide: boolean;
  id: string;
  toggleModal: () => void;
}) => {
  
  const join = async () => {
    await joinRoom(props.id);
    props.toggleModal();
  };
  return (
    <ModalWrapper hideModal={props.hide} >
      <ModalContainer>
        <TitleContainer>
          <TitleText>Join room</TitleText>
          <ActionsContainer>
            <CloseButton >
              <CloseIcon className="fas fa-times" />
            </CloseButton>
          </ActionsContainer>
        </TitleContainer>
        <FormContainer>
          <InputContainer>
            <DescriptionContainer>
              <DescriptionText>{`You want to enter the room with id: ${props.id}`}</DescriptionText>
            </DescriptionContainer>
            <CreateButton onClick={() => join()}>
              <CreateButtonText>Join Room</CreateButtonText>
            </CreateButton>
          </InputContainer>
        </FormContainer>
      </ModalContainer>
    </ModalWrapper>
  );
};
