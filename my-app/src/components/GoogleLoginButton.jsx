import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function GoogleLoginButton({ onLoginSuccess }) {
  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    await axios.post('http://localhost:3000/auth/google',
      { token },
      { withCredentials: true }
    ); 
    

    window.location.href = "/";
    onLoginSuccess(); // Gọi hàm reload thông tin user

  };

  const handleError = () => {
    console.log('Google Login Failed');
  };

  return (
    <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
  );
}
