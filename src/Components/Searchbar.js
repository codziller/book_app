import React from "react";
import { Search } from "./Icons";

function SearchBar({ placeholder, barClassName, onChange, value }) {
  return (
    <div style={{ width: "60%" }}>
      <div className="search_bar">
        <input placeholder="Search" onChange={onChange} value={value}></input>
        <button className="helper_button">
          <Search width="1.2em" height="1.2em" />
        </button>
      </div>
    </div>
  );
}
export default SearchBar;
