import Box from '@mui/material/Box';

const footerStyle = {
  backgroundColor: '#f5f5f5',
  padding: '10px',
  textAlign: 'center',
};

function Footer() {
  return (
    <Box sx={{ ...footerStyle, position: 'fixed', left: 0, bottom: 0, width: '100%', color: "#9c27b0" }}>
      Web Warriors 2023
    </Box>
  );
}

export default Footer;
