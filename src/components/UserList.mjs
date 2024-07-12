import React from "react";
import "../styles/UserList.scss";

const UserList = ({ users }) => {
	return (
		<div className="user-list">
			{users.map((user, index) => (
				<div key={index} className="user-item">
					<img
						src={`https://avatars.dicebear.com/api/initials/${user.username}.svg`}
						alt={user.username}
					/>
					<span>{user.username}</span>
				</div>
			))}
		</div>
	);
};

export default UserList;
