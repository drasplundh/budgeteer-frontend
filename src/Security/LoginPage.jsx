import { useState } from 'react';

export default function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        const res = await fetch('/api/login', {
            method: 'POST',
            header: { 'Content-type': 'applcation/x-www-form-urlencoded' },
            body: new URLSearchParams({ username, password}),
        });
        if (res.ok) onLogin();
        else setError('Invalid username or password');
    }

  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" autoComplete="username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password" />
      <button type="submit">Log in</button>
      {error && <p>{error}</p>}
    </form>
  );
}