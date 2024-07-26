//reference : Github Copilot
// hooks/useErrorHandler.js
import { useState } from 'react';
import Swal from 'sweetalert2';

export function useErrorHandler() {
  const [error, setError] = useState(null);

  const handleError = (errorMessage) => {
    setError(errorMessage);
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  };

  return { error, handleError };
}
