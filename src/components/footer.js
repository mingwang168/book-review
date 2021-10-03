import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <div className="container-fluid" style={{ textAlign: "center" }}>
      <div className="row">
        <div style={{ textAlign: "center" }}>
          Copyright &copy; {year} by Ming Wang.
        </div>
      </div>
    </div>
  );
};

export default Footer;
