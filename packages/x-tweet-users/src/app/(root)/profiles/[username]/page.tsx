import React from 'react';

interface ProfilePageProps {
  params: { username: string };
}

const ProfilePage: React.FC<ProfilePageProps> = ({ params }) => {
  return (
    <div>
      <h1>Profile of {params.username}</h1>
      <p>User details and tweets will appear here.</p>
    </div>
  );
};

export default ProfilePage;
