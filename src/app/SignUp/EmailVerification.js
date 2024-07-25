import { sendEmailVerification , deleteUser , reload} from 'firebase/auth';
import Swal from 'sweetalert2';


const checkEmailVerified = async (auth) => {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(async () => {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 2000);
  
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Email verification timeout'));
      }, 60000);
    });
  };



export const EmailVerification = async (user, auth) => {
    try {
      await sendEmailVerification(auth.currentUser);
      Swal.fire({
        title: 'Verification Email Sent',
        text: 'Please verify your email to complete the sign-up process',
        icon: 'success',
        confirmButtonText: 'OK'
      });
  
      await checkEmailVerified(auth);
      return true;
    } catch (error) {
      console.error("Verification Failed:", error);
      Swal.fire({
        title: 'Failed to send verification email',
        text: 'Please sign up again with a valid email address.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      await deleteUser(auth.currentUser);
      return false;
    }
  };