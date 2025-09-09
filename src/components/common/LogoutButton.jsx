import React from 'react'
import Cookies from 'js-cookie';

const LogoutButton = () => {
    const handleLogoutButton = () => {
        Cookies.remove('login_session');
        window.location.reload();
    }

    return (
        <>
            {Cookies.get('login_session') && (
                <div>
                    <button id="logout-btn" type="button" className="logout-btn" data-focus-right={false} data-focus-up={false} onClick={handleLogoutButton} >
                        Logout
                    </button>
                </div>
            )}
        </>
    )
}

export default LogoutButton
