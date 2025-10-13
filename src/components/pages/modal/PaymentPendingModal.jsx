/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import '../../../assets/styles/LoginPage.css';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

const PaymentPendingModal = ({price, video_id, valid_date, video_name, video_access_start_time, video_access_end_time}) => {
    const [jwtToken, setJwtToken] = useState(null);
    const user_id = localStorage.getItem('user_id');

    useEffect(() => {
      const fetchJWTToken = async () => {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/generate-jwt`, {
            video_name,
            price,
            video_id,
            valid_date,
            video_access_start_time, 
            video_access_end_time,
            user_id
        });
        setJwtToken(response.data.token);
      };
  
      fetchJWTToken();
    }, [price, video_id, valid_date]);

        // Setup message listener for Stripe success
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data === 'payment_success') {
                
                const initialUrl = sessionStorage.getItem('initialUrl');
               
                if (initialUrl) {
                    sessionStorage.removeItem('initialUrl');
                    window.location.href =  initialUrl; // or navigate(initialUrl) if using React Router
                } else {
                    window.location.reload(); // fallback
                }
            }
        };
    
        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);
        
    
        // Open Stripe payment in new window
    const handlePaymentClick = () => {
        if (!jwtToken) return;
        const qrCodeUrl = `${process.env.REACT_APP_DISABILITY_OWNED}/rent-video?q=${jwtToken}&user_id=${user_id}`;
        window.open(qrCodeUrl, '_blank', 'width=600,height=800');
    };
        
    const qrCodeUrl = `${process.env.REACT_APP_DISABILITY_OWNED}/rent-video?q=${jwtToken}&user_id=${user_id}`;
    return (
        <div className="login-modal-inner">
            <h1 className='payment_pending_modal_heading'>Payment Pending</h1>
            <h5>This video is available for <strong>{valid_date}</strong>.</h5>
            <h5 className='payment_pending_modal_sub_heading'>Your payment for this video is still pending. To enjoy uninterrupted access, please complete your purchase using the link below or by scanning the QR code with your smart device for a seamless experience:</h5>

            <div className='payment_pending_modal_qr_div col-md-12'>
                {/* <div className='col-md-6 payment_pending_modal_a_div'>
                    <a href={qrCodeUrl} className='payment_pending_modal_a_tag' target="_blank" rel="noopener noreferrer">Disability Owned</a>
                </div> */}
                <div className='col-md-6 payment_pending_modal_a_div'>
                    <button onClick={handlePaymentClick} className='payment_pending_modal_a_tag'>
                        Disability Owned
                    </button>
                </div>
                <div className='col-md-6'>
                    <QRCodeSVG value={qrCodeUrl} size={180} />
                </div>
            </div>
        </div>
    );
};

export default PaymentPendingModal;
