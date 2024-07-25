// hooks/useSignUpForm.js
import { useState } from 'react';

export function useSignUpForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    confirmPassword: "",
    companyName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  return { formData, setFormData, handleChange };
}