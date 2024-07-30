import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Form.css";
import { apiSignUp } from "./common/api";

const FormSignUp = () => {
    const [Fname, setFname] = useState("");
    const [Lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate(); // Khởi tạo history

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (password !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }
            let data = {
                email: email,
                password: password,
                firsName: Fname,
                lastName: Lname,
                fullName: `${Fname} ${Lname}`,
                roles : "admin",
            }
            let response = await apiSignUp(data);
            if (response) {
                if (response.status === "success") {
                    navigate("/login")
                }
                else {
                    alert("Register failed.");
                }
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <div className="container">
                <div className="header">
                    <div className="text">Sign Up</div>
                    <div className="underline"></div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={Fname}
                            onChange={(e) => setFname(e.target.value)}
                        />
                    </div>
                    <div className="input">
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={Lname}
                            onChange={(e) => setLname(e.target.value)}
                        />
                    </div>
                    <div className="input">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="input">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div className="login-link">
                    Already have an account? <Link to="/logIn">Login here</Link>
                </div>
                <div className="submit-container">
                    <button type="submit" className="submit" onClick={handleSubmit}>Sign Up</button>
                </div>
            </div>
        </form>
    );
};

export default FormSignUp;
