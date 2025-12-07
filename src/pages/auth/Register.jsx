import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';
import { FcGoogle } from 'react-icons/fc';
import { MdEmail } from 'react-icons/md';

const Register = () => {
  const { register: registerForm, handleSubmit, formState: { errors }, watch } = useForm();
  const { register: registerUser, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await registerUser(data.name, data.email, data.password, data.photo);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Account created successfully',
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Registration failed',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Registered with Google',
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Google sign-in failed',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
      <div className="card w-full max-w-md bg-base-100 rounded-3xl border border-base-300">
        <div className="card-body">
          {/* Logo */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-[#20beff] mb-2">ContestSphere</h1>
            <h2 className="text-3xl font-bold text-base-content">Welcome!</h2>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-8 mb-8">
            <Link to="/login" className="text-lg font-semibold text-base-content/60 pb-2">
              Sign In
            </Link>
            <button className="text-lg font-semibold border-b-2 border-[#20beff] pb-2">
              Register
            </button>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="btn btn-outline w-full rounded-full gap-2 mb-4"
          >
            <FcGoogle size={24} />
            Register with Google
          </button>

          {/* Email/Password Form Button */}
          <button
            onClick={() => document.getElementById('register_form').classList.toggle('hidden')}
            className="btn btn-outline w-full rounded-full gap-2 mb-4"
          >
            <MdEmail size={24} />
            Register with Email
          </button>

          {/* Register Form (Initially Hidden) */}
          <form id="register_form" className="hidden" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control mb-4">
              <input
                type="text"
                placeholder="Full Name"
                className="input input-bordered w-full rounded-full"
                {...registerForm('name', { 
                  required: 'Name is required',
                  minLength: {
                    value: 3,
                    message: 'Name must be at least 3 characters'
                  }
                })}
              />
              {errors.name && (
                <span className="text-error text-sm mt-1 ml-4">{errors.name.message}</span>
              )}
            </div>

            <div className="form-control mb-4">
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full rounded-full"
                {...registerForm('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && (
                <span className="text-error text-sm mt-1 ml-4">{errors.email.message}</span>
              )}
            </div>

            <div className="form-control mb-4">
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full rounded-full"
                {...registerForm('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              {errors.password && (
                <span className="text-error text-sm mt-1 ml-4">{errors.password.message}</span>
              )}
            </div>

            <div className="form-control mb-6">
              <input
                type="url"
                placeholder="Photo URL"
                className="input input-bordered w-full rounded-full"
                {...registerForm('photo', { 
                  required: 'Photo URL is required',
                  pattern: {
                    value: /^https?:\/\/.+\..+/i,
                    message: 'Invalid URL'
                  }
                })}
              />
              {errors.photo && (
                <span className="text-error  text-sm mt-1 ml-4">{errors.photo.message}</span>
              )}
            </div>

            <button type="submit" className="btn bg-[#20beff] w-full rounded-full">
              Register
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-base-content/70">
            Have an account?{' '}
            <Link to="/login" className="text-[#20beff] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;