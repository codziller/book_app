import React from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  NavbarText,
  Nav,
  Button,
} from "reactstrap";
import Logo from "./Logo";

function NavBar({ isOpen, toggleClick, navClick, navigation, color }) {
  return (
    <Navbar color="info" light expand="md" className="mb-3">
      <NavbarBrand href="/">
        Quiz App <Logo />
      </NavbarBrand>
      <NavbarToggler onClick={toggleClick} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar></Nav>
        <NavbarText>
          <Button size="sm" color={color} onClick={navClick}>
            {navigation}
          </Button>
        </NavbarText>
      </Collapse>
    </Navbar>
  );
}
export default NavBar;
