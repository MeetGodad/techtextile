//reference : Github Copilot
// hooks/usePasswordValidation.js
import { useState, useEffect } from 'react';

export function usePasswordValidation(password, confirmPassword) {
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false
  });
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    const newRequirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password ? password === confirmPassword : false
    };

    setRequirements(newRequirements);
    setPasswordError(!Object.values(newRequirements).every(Boolean));
  }, [password, confirmPassword]);

  return { requirements, passwordError };
}
