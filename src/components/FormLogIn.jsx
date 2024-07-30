import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Form.css";

import email_icon from "./Asset/email.png";
import password_icon from "./Asset/password.png";
import { apiLogin, apiLoginClient } from "./common/api";

const FormLogIn = () => {
    const navigate = useNavigate(); // Khởi tạo history
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginClient, setIsLoginClient] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response = null;
            if (isLoginClient) {
                let data = {
                    phone: email,
                    password: password
                }
                response = await apiLoginClient(data);
                console.log(response)
            }
            else {
                let data = {
                    email: email,
                    password: password
                }
                response = await apiLogin(data);
            }
            // let response = await apiLogin(data);
            if (response) {
                if (response.status === "success") {
                    if (response.data) {
                        if (isLoginClient) {
                            if (response.data.phone === email) {
                                let infoUser = { ...response.data };
                                delete (infoUser.password);
                                localStorage.setItem("infoUser", JSON.stringify(infoUser));
                                navigate("/main", { replace: true });
                            }
                            else {
                                alert("Email or Password incorect.");
                            }
                        }
                        else {
                            if (response.data.email === email) {
                                let infoUser = { ...response.data };
                                delete (infoUser.password);
                                localStorage.setItem("infoUser", JSON.stringify(infoUser));
                                navigate("/main", { replace: true });
                            }
                            else {
                                alert("Email or Password incorect.");
                            }
                        }

                    }
                    else {
                        alert("Email or Password incorect.");
                    }
                }
                else {
                    alert("Email or Password incorect.");
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <div className="text">Login</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={email_icon} alt="Email Icon" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown} // Use onKeyDown instead of onKeyPress
                    />
                </div>
                <div className="input">
                    <img src={password_icon} alt="Password Icon" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown} // Use onKeyDown instead of onKeyPress
                    />
                </div>
            </div>

            <div className="forgot-password">Forgot password <span>Click here!</span></div>

            <div className="signup-link">
                <Link to="/signup">Sign Up Here</Link>
            </div>
            <div className="form-check mx-3 mt-2">
                <input
                    className="form-check-input"
                    type="checkbox"
                    value={isLoginClient}
                    id="flexCheckDefault"
                    onChange={() => { setIsLoginClient(prev => !prev) }}
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                    Login for Client
                </label>
            </div>

            <div className="submit-container">
                {/* Call handleSubmit function when login button is clicked */}
                <div className="submit" onClick={handleSubmit}>Login</div>
            </div>

        </div>
    );
};

export default FormLogIn;
