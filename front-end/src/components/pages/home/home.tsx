import React from "react";
import styled from "styled-components";
const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #faf;

`;
export const Home = () => {
    return (<Container>
        <h1>Home</h1>
    </Container>)
}