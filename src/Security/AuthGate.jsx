import { useEffect, useState } from 'react';
import { loginApi, setUnauthorizedHandler } from '../api/LoginApi'
import LoginPage from './LoginPage'

export default function AuthGate({ children }) {
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        setUnauthorizedHandler(() => setStatus('anon'));

        loginApi('/api/accounts')
        .then(() => setStatus('authed'))
        .catch(() => setStatus('anon'));
    }, []);

    if (status === 'loading') return <div>Loading...</div>
    if (status === 'anon') return <LoginPage onLogin={()=> setStatus('authed')}/>
    return children;
}
