// components/GoogleAuthButton.jsx
import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const GoogleAuthButton = () => (
  <a
    href="http://localhost:8080/auth/google"
    className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition text-black"
  >
    <FcGoogle size={20} />
    <span>continue with google </span>
  </a>
);

export default GoogleAuthButton;
