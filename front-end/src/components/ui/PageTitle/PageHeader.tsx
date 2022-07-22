import React from "react";
import styled from "styled-components";

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
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
const SyncIcon = styled.i`
  font-size: 1.5rem;
  color: #70a9c7;
  margin-right: 1rem;
`;

const SyncButton = styled.div`
  background: #ffffff;
  border: 1px solid #70a9c7;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 300;
  color: #70a9c7;
  margin-right: 1rem;
  cursor: pointer;
  &:hover {
    background: #fafafa;
    color: #70a9c7;
  }
`;
const SyncText = styled.span`
  font-size: 0.8rem;
  margin-bottom: 0.7rem;
  font-weight: 300;
  color: #70a9c7;
`;

const FilterButton = styled.div`
  background: #ffffff;
  border: 1px solid #70a9c7;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 300;
  color: #70a9c7;
  margin-right: 1rem;
  cursor: pointer;
  &:hover {
    background: #fafafa;
    color: #70a9c7;
  }
`;

const FilterText = styled.span`
  font-size: 0.8rem;
  margin-bottom: 0.7rem;
  font-weight: 300;
  color: #70a9c7;
`;
const FilterIcon = styled.i`
  font-size: 1.5rem;
  color: #70a9c7;
  margin-right: 1rem;
`;

export const PageHeader = (props: {
  title: string;
  
  action1?: string;
  action2?: string;
}) => {
  return (
    <TitleContainer>
      <TitleText>{props.title}</TitleText>
      <ActionsContainer>
        <SyncButton>
          <SyncIcon className="fa-solid fa-arrows-rotate" />
          <SyncText>Sync</SyncText>
        </SyncButton>
        <FilterButton>
          <FilterIcon className="fa-solid fa-filter" />
          <FilterText>Filter</FilterText>
        </FilterButton>
      </ActionsContainer>
    </TitleContainer>
  );
};
