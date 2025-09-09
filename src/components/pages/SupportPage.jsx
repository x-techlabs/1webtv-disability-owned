import React, { useState } from 'react'
import TopMenu from '../common/TopMenu';
import axios from 'axios';
import toast from 'react-hot-toast';

const SupportPage = ({
    activePage,
    menuData,
    handlePageChange,
    activePageLayoutType,
}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [subjectError, setSubjectError] = useState('');
    const [messageError, setMessageError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Reset errors
        setNameError('');
        setEmailError('');
        setSubjectError('');
        setMessageError('');

        let valid = true;

        if (!name.trim()) {
            setNameError('Name is required.');
            valid = false;
        }

        if (!email) {
            setEmailError('Email is required.');
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError('Email must be valid.');
            valid = false;
        }

        if (!subject.trim()) {
            setSubjectError('Subject is required.');
            valid = false;
        }

        if (!message.trim()) {
            setMessageError('Message is required.');
            valid = false;
        }

        if (!valid) {
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/support`, {
                name,
                email,
                subject,
                message
            });

            if (response.data.status_code === 200) {
                toast.success(response.data.message || 'Support request submitted successfully.');
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
            } else {
                toast.error(response.data.message || 'Something went wrong.');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to send support request.');
        } finally {
            setIsSubmitting(false);
        }    
    };

    return (
        <div className='app-container'>
            <TopMenu
                menuData={menuData}
                activePage={activePage}
                handlePageChange={handlePageChange}
                activePageLayoutType={activePageLayoutType}
            />
            <div className='main-cont support_main_cont'>
                <div className='support_content'>
                    <p>We are at your disposal for any technical need or simple assistance. You can fill out the form or write to us at <a href={`mailto:${process.env.REACT_APP_SUPPORT_EMAIL}`} target='_blank' className='support_email_link'>{process.env.REACT_APP_SUPPORT_EMAIL}</a>!</p>
                </div>
                <div className="form-wrapper">
                    <h1 className='text-center support_heading'>Support Form</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name" className='label_text support_label_text'>Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" />
                            {nameError && <p className="support-error-message">{nameError}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className='label_text support_label_text'>Email</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
                            {emailError && <p className="support-error-message">{emailError}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject" className='label_text support_label_text'>Subject</label>
                            <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject of your request" />
                            {subjectError && <p className="support-error-message">{subjectError}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="message" className='label_text support_label_text'>Message</label>
                            <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your issue or request..." />
                            {messageError && <p className="support-error-message">{messageError}</p>}
                        </div>

                        <button type="submit" className="support-btn" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Request'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
