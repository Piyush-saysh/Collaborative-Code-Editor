import React from 'react';
import Avatar from 'react-avatar';

function Client({ userName }) {
  return (
    <div className="flex items-center mb-4 p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
      <Avatar name={userName} size="40" round="14px" className="mr-3" />
      <span className="text-gray-200 font-medium text-sm md:text-base">
        {userName}
      </span>
    </div>
  );
}

export default Client;


