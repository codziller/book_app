import React from "react";

function Search(props) {
  return (
    <svg
      className={props.className}
      width={props.width}
      height={props.height}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.3"
        d="M14.2929 17.2686C13.9024 16.8781 13.9024 16.2449 14.2929 15.8544C14.6834 15.4639 15.3166 15.4639 15.7071 15.8544L19.7071 19.8544C20.0976 20.2449 20.0976 20.8781 19.7071 21.2686C19.3166 21.6592 18.6834 21.6592 18.2929 21.2686L14.2929 17.2686Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 11.5615C4 15.4275 7.13401 18.5615 11 18.5615C14.866 18.5615 18 15.4275 18 11.5615C18 7.69553 14.866 4.56152 11 4.56152C7.13401 4.56152 4 7.69553 4 11.5615ZM16 11.5615C16 14.3229 13.7614 16.5615 11 16.5615C8.23858 16.5615 6 14.3229 6 11.5615C6 8.8001 8.23858 6.56152 11 6.56152C13.7614 6.56152 16 8.8001 16 11.5615Z"
        fill="black"
      />
    </svg>
  );
}
function Ellipses(props) {
  return (
    <svg
      className={props.className}
      onClick={props.onClick}
      height={props.height}
      width={props.width}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <path
        fill={props.fill}
        d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"
      ></path>
    </svg>
  );
}
function PasswordToggler(props) {
  return (
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 22 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.0830078 9.71777C1.02301 4.59777 5.51001 0.717773 10.902 0.717773C16.294 0.717773 20.78 4.59777 21.721 9.71777C20.781 14.8378 16.294 18.7178 10.902 18.7178C5.51001 18.7178 1.02401 14.8378 0.0830078 9.71777ZM10.902 14.7178C12.2281 14.7178 13.4999 14.191 14.4375 13.2533C15.3752 12.3156 15.902 11.0439 15.902 9.71777C15.902 8.39169 15.3752 7.11992 14.4375 6.18224C13.4999 5.24456 12.2281 4.71777 10.902 4.71777C9.57593 4.71777 8.30416 5.24456 7.36647 6.18224C6.42879 7.11992 5.90201 8.39169 5.90201 9.71777C5.90201 11.0439 6.42879 12.3156 7.36647 13.2533C8.30416 14.191 9.57593 14.7178 10.902 14.7178ZM10.902 12.7178C10.1064 12.7178 9.3433 12.4017 8.78069 11.8391C8.21808 11.2765 7.90201 10.5134 7.90201 9.71777C7.90201 8.92212 8.21808 8.15906 8.78069 7.59645C9.3433 7.03384 10.1064 6.71777 10.902 6.71777C11.6977 6.71777 12.4607 7.03384 13.0233 7.59645C13.5859 8.15906 13.902 8.92212 13.902 9.71777C13.902 10.5134 13.5859 11.2765 13.0233 11.8391C12.4607 12.4017 11.6977 12.7178 10.902 12.7178Z"
        fill="#8E919C"
      />
    </svg>
  );
}

function Left(props) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="chevron-left"
      className="svg-inline--fa fa-chevron-left fa-w-10"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
      width={props.width}
      height={props.height}
    >
      <path
        fill={props.fill}
        d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"
      ></path>
    </svg>
  );
}

function Right(props) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="chevron-right"
      className="svg-inline--fa fa-chevron-right fa-w-10"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
      width={props.width}
      height={props.height}
    >
      <path
        fill={props.fill}
        d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
      ></path>
    </svg>
  );
}
export { Search, Ellipses, PasswordToggler, Left, Right };
