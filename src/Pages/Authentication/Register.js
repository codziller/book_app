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

const Register = () => {
  let history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({
    email: true,
    password: true,
    first_name: true,
    last_name: true,
  });
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    let regg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (
      email === "" ||
      password === "" ||
      first_name === "" ||
      last_name === ""
    ) {
      setSuccess({
        ...success,
        email: false,
        password: false,
        first_name: false,
        last_name: false,
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
        first_name: first_name,
        last_name: last_name,
        username:
          first_name + last_name + Math.floor(Math.random() * 10000).toString(),
      };

      await AuthService.register(bodyParameters)
        .then(
          () => {
            history.push("/login");
          },
          (error) => {
            const err =
              error && (error.response || error.message || error.toString());
            let errMsg =
              err.data.first_name ||
              err.data.last_name ||
              err.data.password ||
              err.data.email;
            setError(errMsg);
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
        navigation="Login"
        navClick={() => history.push("/login")}
        color="primary"
      />
      <div className="auth_form_container">
        <div className="form_left text-center">
          <div className="backdrop">
            <div className="form_left_text">
              <h1 className="text-white">Welcome!</h1>
              <h6 className="text-white normal_text">Ready for some quiz ?</h6>
              <h6 className="text-white tiny_text mt-4">
                Already have an account? Login
              </h6>
              <Link to="/login">
                <Button color="info" size="sm">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div style={{ width: "100%" }}>
          <Form className="auth_form" onSubmit={handleRegister}>
            <h1 className="title_text">Register</h1>
            <h6 className="error_text" style={{ height: "16px" }}>
              {error}
            </h6>
            <FormGroup>
              <Label className="label">First Name</Label>
              <Input
                placeholder="Enter first name"
                type="name"
                value={first_name}
                onChange={(e) => setFirst_name(e.target.value)}
                onFocus={() => {
                  setSuccess({
                    ...success,
                    first_name: true,
                  });
                }}
                className={
                  (success.first_name && "default_input") || "error_input"
                }
              />
            </FormGroup>
            <FormGroup>
              <Label className="label">Last Name</Label>
              <Input
                placeholder="Enter last name"
                type="name"
                value={last_name}
                onChange={(e) => setLast_name(e.target.value)}
                onFocus={() => {
                  setSuccess({
                    ...success,
                    last_name: true,
                  });
                }}
                className={
                  (success.last_name && "default_input") || "error_input"
                }
              />
            </FormGroup>
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
              type="submit"
              className="mb-4"
              color="success"
              size="sm"
              block
              disabled={loading}
            >
              Continue
              {loading && <Spinner color="light" size="sm" className="ml-1" />}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default Register;
