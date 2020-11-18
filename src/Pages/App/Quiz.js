import React from "react";
import Logo from "../../Components/Logo";
import { Left, Right } from "../../Components/Icons";
import { Button } from "reactstrap";
export default function Quiz({
  index,
  question,
  options,
  backClick,
  prevClick,
  prevDisabled,
  nextClick,
  nextDisabled,
}) {
  return (
    <div className="home_body">
      <nav className="quiz_header_section">
        <Button
          size="sm"
          color="danger"
          onClick={backClick}
          style={{ width: "80px", display: "flex", alignItems: "center" }}
        >
          <Left width="1em" height="1em" fill="white" />
          <h6 style={{ margin: "7px 0 7px 5px" }}>Back</h6>
        </Button>

        <Logo />
        <h6>{index}/10</h6>
      </nav>
      <div className="quiz_body">
        <div className="questions_section">{question}</div>

        <div className="options_container">{options}</div>
        <div className="quiz_nav_body">
          <Button
            size="sm"
            color="primary"
            onClick={nextClick}
            disabled={nextDisabled}
          >
            <h6>Next</h6>
            <Right width="1em" height="1em" fill="white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
