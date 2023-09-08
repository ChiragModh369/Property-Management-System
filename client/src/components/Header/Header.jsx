import React, { useState } from "react";
import "./Header.css";
import { BiMenuAltRight } from "react-icons/bi";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, NavLink } from "react-router-dom";
import useHeaderColor from "../../hooks/useHeaderColor";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import AddPropertyModal from "../AddPropertyModal/AddPropertyModal";
import useAuthCheck from "../../hooks/useAuthCheck";

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const headerColor = useHeaderColor();
  const [modalOpened, setModalOpened] = useState(false);
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();
  const { validateLogin } = useAuthCheck();
  const handleAddPropertyClick = () => {
    if (validateLogin()) {
      setModalOpened(true);
    }
  };

  const getMenuStyle = (menuOpened) => {
    if (document.documentElement.clientWidth <= 800) {
      return { right: !menuOpened && "-100%" };
    }
  };

  return (
    <section className="h-wrapper" style={{ background: headerColor }}>
      <div className="flexCenter paddings innerWidth h-container">
        {/* Logo */}
        <Link to="/">
          <img src="../logo.png" alt="Logo" width={100} />
        </Link>

        <OutsideClickHandler
          onOutsideClick={() => {
            setMenuOpened(false);
          }}
        >
          <div className="flexCenter h-menu" style={getMenuStyle(menuOpened)}>
            <NavLink to="/properties">Properties</NavLink>

            <a href="mailto:modhchirag149@gmail.com">Contact</a>

            {/* Add Property */}
            <div onClick={handleAddPropertyClick}>Add Property</div>
            <AddPropertyModal opened={modalOpened} setOpened={setModalOpened} />

            {/* Login Button */}
            {!isAuthenticated ? (
              <button className="button" onClick={loginWithRedirect}>
                Login
              </button>
            ) : (
              <ProfileMenu user={user} logout={logout} />
            )}
          </div>
        </OutsideClickHandler>

        <div className="menu-icon">
          <BiMenuAltRight
            size={30}
            onClick={() => setMenuOpened((prev) => !prev)}
          />
        </div>
      </div>
    </section>
  );
};
export default Header;
