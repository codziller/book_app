import React, { useState } from "react";
import Navbar from "../../Components/Navbar";
import { PasswordToggler } from "../../Components/Icons";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Spinner,
} from "reactstrap";
import AuthService from "../../Services/auth.service";
import { Link, useHistory } from "react-router-dom";
const Login = () => {
  let history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({ email: true, password: true });
  const [placeHolder, setPlaceHolder] = useState("Enter email");
  const [passwordType, setPasswordType] = useState("password");
  const [error, setError] = useState("");
  const [isOpen, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!isOpen);
  };
  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    let regg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (email === "" || password === "") {
      setSuccess({
        ...success,
        email: false,
        password: false,
      });
    } else if (regg.test(email) === false) {
      setSuccess({
        ...success,
        email: false,
      });
      setPlaceHolder("Enter valid email");
      setEmail("");
    } else {
      setLoading(true);
      var bodyParameters = {
        email: email,
        password: password,
      };

      await AuthService.login(bodyParameters)
        .then(
          () => {
            history.push("/home");
          },
          (error) => {
            const err =
              error && (error.response || error.message || error.toString());
            setError(err.data.detail);
          }
        )
        .finally(() => setLoading(false));
    }
  };

  return (
    <div>
      <Navbar
        isOpen={isOpen}
        toggleClick={toggle}
        navigation="Create Account"
        navClick={() => history.push("/register")}
        color="primary"
      />

      <div className="auth_form_container">
        <div className="form_left text-center">
          <div className="backdrop">
            <div className="form_left_text">
              <h1 className="text-white">Welcome Back!</h1>
              <h6 className="text-white normal_text">Ready for some quiz ?</h6>
              <h6 className="text-white tiny_text mt-4">
                Don't have an account? Register
              </h6>
              <Link to="/register">
                <Button color="info" size="sm">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div style={{ width: "100%" }}>
          <Form className="auth_form" onSubmit={handleLogin}>
            <h1 className="title_text">Login</h1>
            <h6 className="error_text" style={{ height: "16px" }}>
              {error}
            </h6>
            <FormGroup>
              <Label className="label">Email</Label>
              <Input
                type="email"
                placeholder={placeHolder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => {
                  setSuccess({
                    ...success,
                    email: true,
                  });
                }}
                className={(success.email && "default_input") || "error_input"}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label className="label">Password</Label>
              <InputGroup>
                <Input
                  placeholder="Enter password"
                  type={passwordType}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => {
                    setSuccess({
                      ...success,
                      password: true,
                    });
                  }}
                  className={
                    (success.password && "default_input") || "error_input"
                  }
                />
                <InputGroupAddon
                  addonType="append"
                  style={{ cursor: "pointer" }}
                  onClick={togglePasswordVisibility}
                >
                  <InputGroupText>
                    <PasswordToggler width="1.1em" height="1.1em" />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>

            <Button
              className="mt-4"
              type="submit"
              color="success"
              size="sm"
              block
              disabled={loading}
            >
              Login
              {loading && <Spinner color="light" size="sm" className="ml-1" />}
            </Button>

            <h6 className="tiny_text mt-2 mb-5">Change password</h6>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default Login;
