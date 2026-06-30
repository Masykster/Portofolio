import { useEffect, useState } from 'react';
import { ClawCaptcha } from './ClawCaptcha';

export default function ClawCaptchaWrapper() {
  const [isVerified, setIsVerified] = useState<boolean>(true); // default to true to avoid layout shifts, update on mount

  useEffect(() => {
    const verifiedSession = sessionStorage.getItem('playcaptcha-verified');
    if (verifiedSession === 'true') {
      setIsVerified(true);
      // Let the page know immediately that we are already verified
      window.dispatchEvent(new CustomEvent('captcha-verified', { detail: { immediate: true } }));
    } else {
      setIsVerified(false);
    }
  }, []);

  const handleVerify = () => {
    sessionStorage.setItem('playcaptcha-verified', 'true');
    setIsVerified(true);
    window.dispatchEvent(new CustomEvent('captcha-verified', { detail: { immediate: false } }));
  };

  if (isVerified) {
    return null;
  }

  return (
    <ClawCaptcha
      onVerify={handleVerify}
      title="Tangkap Pokemon-nya!"
      assetBase="/toys/"
    />
  );
}
