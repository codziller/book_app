import React from "react";
import { Spinner } from "reactstrap";

export default function Logo() {
  return (
    <div className="logo">
      <Spinner
        style={{ width: "1rem", height: "1rem", color: "#cc7722" }}
        type="grow"
      />
      <h6>
        ? <span style={{ fontSize: "20px", color: "#cc7722" }}>?</span> ?
      </h6>
      <Spinner
        style={{ width: "1rem", height: "1rem", color: "#cc7722" }}
        type="grow"
      />
    </div>
  );
}
