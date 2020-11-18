import React from "react";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from "reactstrap";

export default function DropDown({ dropdownOpen, toggleDropDown }) {
  return (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropDown}>
      <DropdownToggle
        caret
        color="info"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "0",
          paddingBottom: "0",
        }}
      >
        <h6 style={{ fontSize: "24px" }}>
          <span style={{ fontSize: "12px" }}>Sort By</span>
        </h6>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem>Tournament Name</DropdownItem>
        <DropdownItem divider />
        <DropdownItem>Difficulty</DropdownItem>
        <DropdownItem divider />
        <DropdownItem>Category</DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );
}
