import React from 'react';
import styled from 'styled-components';

const NavContainer = styled.header`
	width: 100%;
	height: 64px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	background: #ffffff;
	box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.04),
		0px 0px 1px rgba(0, 0, 0, 0.04);
`;
const LogoContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	align-self: center;
	margin-left: 1rem;
`;
const LogoImage = styled.img`
	height: 60px;
	width: auto;
`;

const UserContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-right: 1rem;
`;
const ProfileImage = styled.img`
	height: 40px;
	width: auto;
	border-radius: 50%;
	background: #faa;
`;
const NameContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	margin-right: 1rem;
`;

const Name = styled.span`
	font-size: 1rem;
	font-weight: 600;
	color: #404040;
`;
const Role = styled.span`
	font-size: 0.8rem;
	font-weight: 300;
	color: #AEAEAE;
`;
export const NavBar = (props: {
	logo: string;
	user: {
		name: string;
		role: string;
		photo: string;
	};
}) => {
	return (
		<NavContainer>
			<LogoContainer>
				<LogoImage src={props.logo} alt="logo" />
			</LogoContainer>
			<UserContainer>		
				<NameContainer>
					<Name>{props.user.name}</Name>
					<Role>{props.user.role}</Role>
				</NameContainer>
				<ProfileImage src={props.user.photo} alt="user" />
			</UserContainer>
		</NavContainer>
	);
};