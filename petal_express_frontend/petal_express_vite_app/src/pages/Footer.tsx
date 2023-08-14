import { CSSProperties } from '@mui/material/styles/createTypography';
const Footer = () => {
  const footerStyle : CSSProperties  = {
    backgroundColor: "#9c27b0",
    color: "white",
    textAlign: "center",
    padding: "20px",
    position: "fixed",
    left: 0,
    bottom: 0,
    width: "100%",
  };

  const footerContentStyle : CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const iconStyle : CSSProperties = {
    fontSize: "2rem",
    color: "white",
    margin: "0 10px",
    cursor: "pointer",
    transition: "color 0.3s",
  };

  const copyrightStyle : CSSProperties = {
    fontSize: "0.9rem",
    marginTop: "10px",
  };

  const ulStyle : CSSProperties = {
    display: "flex",
    margin: "0",
    padding: "0",
    listStyleType: "none",
  };

  return (
    <footer style={footerStyle}>
      <div style={footerContentStyle}>
        <div>
          <ul style={ulStyle}>
            <li>
              <a href="https://www.facebook.com/">
                <i
                  style={iconStyle}
                  className="fa fa-facebook"
                  aria-hidden="true"
                ></i>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/?hl=en">
                <i
                  style={iconStyle}
                  className="fa fa-instagram"
                  aria-hidden="true"
                ></i>
              </a>
            </li>
            <li>
              <a href="https://www.pinterest.com/">
                <i
                  style={iconStyle}
                  className="fa fa-pinterest-p"
                  aria-hidden="true"
                ></i>
              </a>
            </li>
            <li>
              <a href="https://twitter.com/?lang=en">
                <i
                  style={iconStyle}
                  className="fa fa-twitter"
                  aria-hidden="true"
                ></i>
              </a>
            </li>
          </ul>
        </div>
        <p style={copyrightStyle}>
          &copy; 2023 Web Warriors. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
