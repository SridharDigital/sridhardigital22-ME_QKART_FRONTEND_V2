import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const isLoggedIn = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const onClickLogOut = () => {
    localStorage.clear();
    window.location.reload();
  };
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      {!hasHiddenAuthButtons ? (
        <>
          {isLoggedIn ? (
            <>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Avatar alt={username} src="avatar.png" />
                <p>{username}</p>
                <Button
                  className="explore-button"
                  variant="text"
                  onClick={onClickLogOut}
                >
                  LOGOUT
                </Button>
              </Stack>
            </>
          ) : (
            <>
              <Stack spacing={2} direction="row">
                <Link to={"/login"}>
                  <Button className="explore-button" variant="text">
                    LOGIN
                  </Button>
                </Link>
                <Link to={"/register"}>
                  <Button className="button" variant="contained">
                    REGISTER
                  </Button>
                </Link>
              </Stack>
            </>
          )}
        </>
      ) : (
        <Link to={"/"}>
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
          >
            Back to explore
          </Button>
        </Link>
      )}
    </Box>
  );
};

export default Header;
