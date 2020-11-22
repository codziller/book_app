import React from "react";
import { CloseIcon, Info } from "./Icons";
const Toast = ({ toastClass, closeClick }) => (
  <div
    className={`toast_container ${toastClass}`}
    style={{ background: "#28a745" }}
  >
    <div style={{ width: "1.2em", marginRight: "0.3em" }}>
      <Info width="1.2em" height="1.2em" fill="#ff6f4f" />
    </div>
    <div>
      <h5 style={{ fontSize: "1em", marginBottom: "1em", color: "white" }}>
        ## PRICING
      </h5>
      <h6>
        1. Regular Books - $1 for 1st 2 days and $1.5 after (minimuum charge is
        $2)
      </h6>

      <h6>2. Novel Books - Minimum charge of $4.5, daily charge of $1.5</h6>
      <h6>3. Daily charge of $3</h6>
    </div>
    <button onClick={closeClick}>
      <CloseIcon width="1.2em" height="1.2em" fill="#ffffff" />
    </button>
  </div>
);
export default Toast;
