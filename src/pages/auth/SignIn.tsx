import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import authservice from "../../services/authService";

function SignIn() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [formData, setFromData] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string>("");

    const handleData = (e: ChangeEvent<HTMLInputElement>) => {
        setFromData({ ...formData, [e.target.name]: e.target.value });

        // Clear field-specific error when user starts typing
        if (errors[e.target.name]) {
            const newErrors = { ...errors };
            delete newErrors[e.target.name];
            setErrors(newErrors);
        }

        // Clear general error when user starts typing
        if (generalError) {
            setGeneralError("");
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authservice.signIn(formData);
            setUser(response.user);
            navigate("/");
        } catch (err: any) {
            const data = err?.response?.data;

            if (data?.fields) {
                setErrors(data.fields);
            }

            if (data?.error) {
                setGeneralError(data.error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center p-8 bg-linear-to-br from-purple-600 via-purple-700 to-indigo-800 relative overflow-hidden'>
            {/* Decorative background elements */}
            <div className='absolute w-96 h-96 bg-white/10 rounded-full -top-20 -left-20 blur-3xl animate-pulse'></div>
            <div className='absolute w-80 h-80 bg-white/10 rounded-full -bottom-20 -right-20 blur-3xl animate-pulse delay-1000'></div>

            {/* Main Card */}
            <div className='bg-white/95 backdrop-blur-xl rounded-3xl p-12 w-full max-w-md shadow-2xl relative z-10 animate-in slide-in-from-bottom-8 duration-700 border border-white/20'>
                {/* Header */}
                <div className='text-center mb-10'>
                    <h1 className='text-4xl font-bold text-gray-900 mb-2 tracking-tight'>
                        Welcome Back
                    </h1>
                    <p className='text-gray-600 text-base'>
                        Sign in to continue your journey
                    </p>
                </div>

                {/* General Error Message */}
                {generalError && (
                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-in slide-in-from-top-2 duration-300'>
                        <p className='text-sm font-medium'>{generalError}</p>
                    </div>
                )}

                {/* Form */}
                <form className='space-y-6' onSubmit={handleSubmit} noValidate>
                    {/* Email Field */}
                    <div className='flex flex-col gap-2'>
                        <label
                            htmlFor='email'
                            className='text-sm font-semibold text-gray-700 tracking-wide'>
                            Email Address
                        </label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            onChange={handleData}
                            value={formData.email}
                            className='w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 bg-white text-gray-800 placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:-translate-y-0.5 hover:border-gray-300'
                            placeholder='you@example.com'
                        />
                        {errors.email && (
                            <p className='text-red-600 text-sm mt-1 animate-in slide-in-from-top-1 duration-200'>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className='flex flex-col gap-2'>
                        <label
                            htmlFor='password'
                            className='text-sm font-semibold text-gray-700 tracking-wide'>
                            Password
                        </label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            onChange={handleData}
                            value={formData.password}
                            className='w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 bg-white text-gray-800 placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:-translate-y-0.5 hover:border-gray-300'
                            placeholder='Enter your password'
                        />
                        {errors.password && (
                            <p className='text-red-600 text-sm mt-1 animate-in slide-in-from-top-1 duration-200'>
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type='submit'
                        disabled={isLoading}
                        className='w-full mt-2 px-4 py-4 text-base font-semibold text-white bg-linear-to-r from-purple-600 to-indigo-700 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/50 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/60 active:translate-y-0 group'>
                        <span>{isLoading ? "Signing In..." : "Sign In"}</span>
                        <svg
                            className='w-5 h-5 transition-transform duration-300 group-hover:translate-x-1'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M13 7l5 5m0 0l-5 5m5-5H6'
                            />
                        </svg>
                    </button>
                </form>

                {/* Footer */}
                <div className='mt-8 pt-6 text-center border-t border-gray-200'>
                    <p className='text-sm text-gray-600'>
                        Don't have an account?{" "}
                        <Link
                            to='/signup'
                            className='text-purple-600 font-semibold transition-all duration-200 hover:text-indigo-700 hover:underline underline-offset-2'>
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
