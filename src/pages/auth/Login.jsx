import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';
import { FcGoogle } from 'react-icons/fc';
import { MdEmail } from 'react-icons/md';
import { Link, useNavigate } from 'react-router';
import Logo from '../../components/shared/Logo';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login, googleSignIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Logged in successfully',
                showConfirmButton: false,
                timer: 1500
            });
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.response?.data?.message || 'Login failed',
            });
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Logged in with Google',
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
        <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sora">
            <div className="card w-full max-w-md bg-base-100 rounded-3xl border border-base-300">
                <div className="card-body">
                    {/* Logo */}
                    <div className="text-center mb-6">
                        <Logo />
                        <h2 className="text-xl font-bold text-base-content mt-2">Welcome!</h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex justify-center gap-8 mb-8">
                        <button className="text-lg font-semibold border-b-2 border-[#20beff] pb-2">
                            Sign In
                        </button>
                        <Link to="/register" className="text-lg font-semibold text-base-content/60 pb-2">
                            Register
                        </Link>
                    </div>

                    {/* Google Sign In Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        className="btn btn-outline w-full rounded-full gap-2 mb-4"
                    >
                        <FcGoogle size={24} />
                        Sign in with Google
                    </button>

                    {/* Email/Password Form */}
                    <button
                        onClick={() => document.getElementById('email_form').classList.toggle('hidden')}
                        className="btn btn-outline w-full rounded-full gap-2 mb-4"
                    >
                        <MdEmail size={24} />
                        Sign in with Email
                    </button>

                    {/* Email Form (Initially Hidden) */}
                    <form id="email_form" className="hidden" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control mb-4">
                            <input
                                type="email"
                                placeholder="Email"
                                className="input input-bordered w-full rounded-full"
                                {...register('email', {
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

                        <div className="form-control mb-6">
                            <input
                                type="password"
                                placeholder="Password"
                                className="input input-bordered  w-full rounded-full"
                                {...register('password', {
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

                        <button type="submit" className="btn bg-[#20beff] w-full rounded-full">
                            Sign In
                        </button>
                    </form>

                    {/* Register Link */}
                    <p className="text-center mt-6 text-base-content/70">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[#20beff] font-semibold hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;