import React, { useState } from 'react';
import '../../../assets/styles/LoginPage.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

const LoginModal = ({ closeModal, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const rayd8_connect_url = process.env.REACT_APP_RAYD8_CONNECT;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');

        let valid = true;
        if (!email) {
            setEmailError('Email is required.');
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError('Email must be valid.');
            valid = false;
        }

        if (!password) {
            setPasswordError('Password is required.');
            valid = false;
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)) {
            setPasswordError('Password must include upper, lower, number & symbol (min 8 chars).');
            valid = false;
        }

        if (!valid) return;

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
                email,
                password,
            });

            if (response.data.status_code === 200) {
                toast.success(response.data.message);
                const token = response.data.user_token;
                const user_id = response.data.user_id;
                
               localStorage.setItem('user_id', user_id);
                
                Cookies.set('login_session', token, { expires: 1 / 24, secure: false, sameSite: 'Lax' });

                if (onLoginSuccess) {
                    onLoginSuccess(token);
                }
                closeModal();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Login failed.');
        }
    };

    return (
        <div className="login-modal-inner">
            <h1 className='login_modal_heading'>LOGIN</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email" className='label_text'>Email</label>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
                    {emailError && <p className="error-message">{emailError}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password" className='label_text'>Password</label>
                    <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
                    {passwordError && <p className="error-message">{passwordError}</p>}
                </div>

                <div className="forgotPassword_button">
                    <a href={`${rayd8_connect_url}/forgot-password`} className="forgot_password_a_tag" target='_blank' rel="noreferrer">Forgot Password?</a>
                </div>

                <button type="submit" className="login-btn">Login</button>

                <div className="links">                    
                    <div className="signUp_button">
                        Don't have an account? Create new account <a href={`${rayd8_connect_url}/register`} className="login_button_a_tag" target='_blank' rel="noreferrer">here</a>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginModal;
