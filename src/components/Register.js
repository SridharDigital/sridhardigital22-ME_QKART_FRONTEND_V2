import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import { useHistory, Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory()


  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    const {username, password} = formData
    const payload = {username, password}
    if(!validateInput(formData)) return
    setIsLoading(true)
    try {
      
      const response = await axios.post(`${config.endpoint}/auth/register`, payload)
      enqueueSnackbar("Registered successfully")
      // console.log(response)
      history.push("/login")
    } catch (error) {
      const response = error.response
      if(response.status === 400) {
        // console.log(response.data.message)
        enqueueSnackbar(response.data.message)
      } else {
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.")
      }
      
    }
    setIsLoading(false)
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    const {username, password, confirmPassword} = data
    if(!username) {
      enqueueSnackbar("Username is a required field")
      return false
    } else if(username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters")
      return false
    } else if(!password) {
      enqueueSnackbar("Password is a required field")
      return false
    } else if(password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters")
      return false
    } else if(password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match")
      return false 
    }
    return true
  };

  const onClickRegister = () => {
    register({username, password, confirmPassword})
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    > 
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
      <>
        <Header hasHiddenAuthButtons />
        <Box className="content">
          <Stack spacing={2} className="form">
            <h2 className="title">Register</h2>
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              title="Username"
              name="username"
              value={username}
              placeholder="Enter Username"
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
            <TextField
              id="password"
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Password must be atleast 6 characters length"
              fullWidth
              placeholder="Enter a password with minimum 6 characters"
            />
            <TextField
              id="confirmPassword"
              variant="outlined"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
            />
            <Button className="button" variant="contained" onClick={onClickRegister}>
              Register Now
            </Button>
            <p className="secondary-action">
              Already have an account?{" "}
              <Link className="link" to="/login">
              Login here
              </Link>
            </p>
          </Stack>
        </Box>
        <Footer />
      </>
      )}
      
    </Box>
  );
};


export default Register
