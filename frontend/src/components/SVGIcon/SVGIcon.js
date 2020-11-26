import React from "react";
const getPath = (props) => {
  switch (props) {
    case "user":
      return "M22 11 C22 16 19 20 16 20 13 20 10 16 10 11 10 6 12 3 16 3 20 3 22 6 22 11 Z M4 30 L28 30 C28 21 22 20 16 20 10 20 4 21 4 30 Z";
    case "password":
      return "M5 15 L5 30 27 30 27 15 Z M9 15 C9 9 9 5 16 5 23 5 23 9 23 15 M16 20 L16 23";
    case "mobile":
      return "M21 2 L11 2 C10 2 9 3 9 4 L9 28 C9 29 10 30 11 30 L21 30 C22 30 23 29 23 28 L23 4 C23 3 22 2 21 2 Z M9 5 L23 5 M9 27 L23 27";
    case "calendar":
      return "M2 6 L2 30 30 30 30 6 Z M2 15 L30 15 M7 3 L7 9 M13 3 L13 9 M19 3 L19 9 M25 3 L25 9";
  }
};
const SVGIcon = (props) => {
  return (
    <svg
      style={{ width: "2rem", height: "1.5rem" }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 32 32"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6.25%"
        d={getPath(props.iconName)}
      />
    </svg>
  );
};

export default SVGIcon;
