import React, { useState } from "react";
import axios from "axios";

const LoginRegister = (props) => {

    // LOGIN
    const [loginName, setLoginName] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // REGISTER
    const [registerData, setRegisterData] = useState({
        login_name: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        location: "",
        description: "",
        occupation: ""
    });

    const [message, setMessage] = useState("");

    // LOGIN
    const handleLogin = () => {

        axios.post(
            "https://tf5pw3-8081.csb.app/api/admin/login",
            {
                login_name: loginName,
                password: loginPassword
            },
            {
                withCredentials: true
            }
        )
            .then((res) => {

                props.setCurrentUser(res.data);

                setMessage("Login successful");

            })
            .catch((err) => {

                if (err.response) {
                    setMessage(err.response.data);
                } else {
                    setMessage("Login failed");
                }

            });
    };

    // REGISTER
    const handleRegister = () => {

        // check confirm password
        if (registerData.password !== registerData.confirmPassword) {

            setMessage("Passwords do not match");
            return;

        }

        axios.post(
            "https://tf5pw3-8081.csb.app/api/admin/user",
            {
                login_name: registerData.login_name,
                password: registerData.password,
                first_name: registerData.first_name,
                last_name: registerData.last_name,
                location: registerData.location,
                description: registerData.description,
                occupation: registerData.occupation
            }
        )
            .then(() => {

                setMessage("Registration successful");

                // clear form
                setRegisterData({
                    login_name: "",
                    password: "",
                    confirmPassword: "",
                    first_name: "",
                    last_name: "",
                    location: "",
                    description: "",
                    occupation: ""
                });

            })
            .catch((err) => {

                if (err.response) {
                    setMessage(err.response.data);
                } else {
                    setMessage("Registration failed");
                }

            });
    };

    return (
        <div>

            {/* LOGIN */}
            <h2>Please Login</h2>

            <input
                type="text"
                value={loginName}
                onChange={(e) =>
                    setLoginName(e.target.value)
                }
                placeholder="login name"
            />

            <br /><br />

            <input
                type="password"
                value={loginPassword}
                onChange={(e) =>
                    setLoginPassword(e.target.value)
                }
                placeholder="password"
            />

            <br /><br />

            <button onClick={handleLogin}>
                Login
            </button>

            <hr />

            {/* REGISTER */}
            <h2>Register</h2>

            <input
                type="text"
                placeholder="login name"
                value={registerData.login_name}
                onChange={(e) =>
                    setRegisterData({
                        ...registerData,
                        login_name: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                type="password"
                placeholder="password"
                value={registerData.password}
                onChange={(e) =>
                    setRegisterData({
                        ...registerData,
                        password: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                type="password"
                placeholder="confirm password"
                value={registerData.confirmPassword}
                onChange={(e) =>
                    setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                type="text"
                placeholder="first name"
                value={registerData.first_name}
                onChange={(e) =>
                    setRegisterData({
                        ...registerData,
                        first_name: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                type="text"
                placeholder="last name"
                value={registerData.last_name}
                onChange={(e) =>
                    setRegisterData({
                        ...registerData,
                        last_name: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                type="text"
                placeholder="location"
                value={registerData.location}
                onChange={(e) =>
                    setRegisterData({
                        ...registerData,
                        location: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                type="text"
                placeholder="occupation"
                value={registerData.occupation}
                onChange={(e) =>
                    setRegisterData({
                        ...registerData,
                        occupation: e.target.value
                    })
                }
            />

            <br /><br />

            <textarea
                placeholder="description"
                value={registerData.description}
                onChange={(e) =>
                    setRegisterData({
                        ...registerData,
                        description: e.target.value
                    })
                }
            />

            <br /><br />

            <button onClick={handleRegister}>
                Register Me
            </button>

            <br /><br />

            <div>{message}</div>

        </div>
    );
};

export default LoginRegister;