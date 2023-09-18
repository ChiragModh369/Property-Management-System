import React from "react";
import { Avatar, Menu } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { replace } from "lodash";

const ProfileMenu = ({ user, logout }) => {
  const navigate = useNavigate();

  return (
    <Menu>
      <Menu.Target>
        <Avatar src={user?.picture} alt="user Image" radius={"xl"} />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>
          {user?.name}
          <br />
          {user?.email}
        </Menu.Item>
        <Menu.Item onClick={() => navigate("./favourites", { replace: true })}>
          Favourites
        </Menu.Item>
        <Menu.Item onClick={() => navigate("./bookings", { replace: true })}>
          Bookings
        </Menu.Item>
        <Menu.Item
          onClick={() => navigate("./PersonalProperties", { replace: true })}
        >
          Personal Properties
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            localStorage.clear();
            logout();
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;
