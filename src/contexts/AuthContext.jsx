import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const authContext = useContext(AuthContext);
    const [userData, setUserData] = useState(authContext);
    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            const response = await fetch(`${server}/api/v1/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, username, password })
            });
            if (response.status === 201) {
                const data = await response.json();
                return data.message;
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (err) {
            console.error("Registration Error:", err);
            throw err;
        }
    };

    const handleLogin = async (username, password) => {
        try {
            const response = await fetch(`${server}/api/v1/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });
            if (response.status === 200) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                router("/home");
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (err) {
            console.error("Login Error:", err);
            throw err;
        }
    };

    const getHistoryOfUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${server}/api/v1/users/get_all_activity?token=${token}`);
            if (response.ok) {
                return await response.json();
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (err) {
            console.error("Get History Error:", err);
            throw err;
        }
    };

    const addToUserHistory = async (meetingCode) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${server}/api/v1/users/add_to_activity`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token, meeting_code: meetingCode })
            });
            if (response.status === 201) {
                return await response.json();
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (err) {
            console.error("Add to History Error:", err);
            throw err;
        }
    };

    const data = {
        userData,
        setUserData,
        addToUserHistory,
        getHistoryOfUser,
        handleRegister,
        handleLogin
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};
