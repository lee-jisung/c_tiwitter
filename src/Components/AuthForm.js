import { authService } from 'fbase';
import React, { useState } from 'react';

function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [err, setErr] = useState('');

  const onSubmit = async e => {
    e.preventDefault();
    try {
      let data;
      if (newAccount) {
        // create account
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        //log in
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data);
    } catch (error) {
      setErr(error.message);
    }
  };
  const toggleAccount = () => setNewAccount(prev => !prev);
  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={e => {
            setEmail(e.target.value);
          }}
          className="authInput"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          className="authInput"
          onChange={e => {
            setPassword(e.target.value);
          }}
        />
        <input
          type="submit"
          className="authInput authSubmit"
          value={newAccount ? 'Create Account ' : 'Sign In'}
        />
        {err && <span className="authError">{err}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? 'Sign In' : 'Create Account'}
      </span>
    </>
  );
}

export default AuthForm;
