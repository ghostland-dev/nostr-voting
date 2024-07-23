import React from 'react';
import useNostr from '../hooks/useNostr';

function Profile() {
  const { user } = useNostr();

  return (
    <div>
      <h2>Profile</h2>
      {user ? (
        <div>
          <p>Public Key: {user.publicKey}</p>
          <p>Private Key: {user.privateKey}</p>
        </div>
      ) : (
        <p>No user logged in</p>
      )}
    </div>
  );
}

export default Profile;
