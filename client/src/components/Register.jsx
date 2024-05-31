import React, { useState, useEffect } from "react";
import { Card, Button, FloatingLabel, Form } from 'react-bootstrap'; 
import toast, { Toaster } from 'react-hot-toast';
import config from "../config";

function Register() {
    const [view, setView] = useState("login");
    const [error, setError] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const changeView = () => {
        setView(view === "login" ? "register" : "login");
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const endpoint = view === "login" ? "login" : "register";
        if (view === "register" && password !== confirmPassword) {
            toast.error("Passwords do not match");
            setError("Passwords do not match");
            
        }
        try {

            const dToIn = {
                email: email,
                password: password,
            };

            const response = await fetch(config.REACT_APP_BACKEND_URI+`/auth/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dToIn),
            });
            if (response.status === 201) {
                toast.success("Successfully registered");
                setView("login");
            } else {
                console.log(response);
                // Save token to local storage
                localStorage.setItem('token', response.userToken);
                localStorage.setItem('loginTime', new Date().toISOString()); // Save login time
                toast.success("Successfully logged in");
                // navigation to home
                window.location.href = '/home';
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            toast.error(error.response.message);
            setError('Failed to authenticate. ' + error.response.message);
        }
    };


    return (
        <div className="Register">
            <Toaster position="top-center" reverseOrder={false}/>
            <div className="Logo">
                <h1>Blinds Control</h1>
                <p>Nějakej slogan.</p>
            </div>
            <div className="Card">
                {view === "register" ? (
                    <Card style={{ width: "30rem" }}>
                        <Card.Title as="h2">Sign Up</Card.Title>
                        {error && <Card.Text className="error-message">{error}</Card.Text>}
                       
                        
                            <Form onSubmit={handleFormSubmit} style={{ padding: "30px" }}>
                                <FloatingLabel label="Email">
                                    <Form.Control
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </FloatingLabel>
                                <FloatingLabel label="Password">
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        style={{ margin: "20px 0" }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </FloatingLabel>
                                <FloatingLabel label="Confirm Password">
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm Password"
                                        style={{ margin: "20px 0" }}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </FloatingLabel>
                                <Button type="submit" style={{ marginTop: "15px" }} disabled={!password || !confirmPassword || password !== confirmPassword}>
                                    {view === "login" ? "Log In" : "Sign Up"}
                                </Button>
                            </Form>
                        
                        <p className="Changer">Already a member? <a href="#!" onClick={changeView}>Login</a></p>
                    </Card>

                ) : (
                    <Card style={{ width: "30rem" }}>
                        <Card.Title as="h2">Login</Card.Title>
                        <Card.Text>
                            {error && <div className="error-message">{error}</div>}

                                <Form onSubmit={handleFormSubmit} style={{ padding: "30px" }}>
                                    <FloatingLabel label="Email">
                                        <Form.Control
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel label="Password">
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            style={{ margin: "20px 0" }}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </FloatingLabel>
                                    <Button type="submit" style={{ marginTop: "15px" }}>
                                        {view === "login" ? "Log In" : "Sign Up"}
                                    </Button>
                                </Form>
                            
                        </Card.Text>
                        <p className="Changer">Need an account? <a href="#!" onClick={changeView}>Sign up</a></p>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default Register;
