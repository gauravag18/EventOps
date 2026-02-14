"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setSuccess("Account created! Please check your email to verify.");
            setFormData({ name: "", email: "", password: "", confirmPassword: "" });

        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: "/" });
    };

    return (
        <div className="min-h-screen w-full relative bg-off-white overflow-hidden flex flex-col lg:flex-row">
            {/* 
        Left Section - Signup Form 
        Positioned as the first flex item, restricted to 45% width to sit in the safe zone.
      */}
            <div className="w-full lg:w-[45%] min-h-screen flex flex-col justify-center items-center p-8 pt-24 z-10 relative">
                <div className="w-full max-w-md space-y-8 bg-white p-10 border-2 border-charcoal-blue shadow-[8px_8px_0px_0px_rgba(31,42,55,0.2)]">
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-black text-charcoal-blue tracking-tighter uppercase">Create Account</h1>
                        <p className="text-sm font-medium text-steel-gray uppercase tracking-wide">
                            Already have an account?{" "}
                            <Link href="/login" className="font-bold text-signal-orange hover:text-charcoal-blue hover:underline underline-offset-4 transition-all">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-4 bg-red-50 border-2 border-red-200 text-red-600 text-sm font-bold uppercase tracking-wide">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-4 bg-green-50 border-2 border-green-200 text-green-700 text-sm font-bold uppercase tracking-wide">
                                {success}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-xs font-bold text-charcoal-blue mb-1 uppercase tracking-widest">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="appearance-none relative block w-full px-4 py-3 border-2 border-soft-slate text-charcoal-blue focus:outline-none focus:border-signal-orange focus:ring-0 transition-all font-medium bg-off-white/30 placeholder-steel-gray/50"
                                    placeholder="JOHN DOE"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-xs font-bold text-charcoal-blue mb-1 uppercase tracking-widest">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="appearance-none relative block w-full px-4 py-3 border-2 border-soft-slate text-charcoal-blue focus:outline-none focus:border-signal-orange focus:ring-0 transition-all font-medium bg-off-white/30 placeholder-steel-gray/50"
                                    placeholder="NAME@COMPANY.COM"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-xs font-bold text-charcoal-blue mb-1 uppercase tracking-widest">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    defaultValue={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="appearance-none relative block w-full px-4 py-3 border-2 border-soft-slate text-charcoal-blue focus:outline-none focus:border-signal-orange focus:ring-0 transition-all font-medium bg-off-white/30 placeholder-steel-gray/50"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-xs font-bold text-charcoal-blue mb-1 uppercase tracking-widest">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="appearance-none relative block w-full px-4 py-3 border-2 border-soft-slate text-charcoal-blue focus:outline-none focus:border-signal-orange focus:ring-0 transition-all font-medium bg-off-white/30 placeholder-steel-gray/50"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3.5 px-4 border-2 border-charcoal-blue text-sm font-black uppercase tracking-widest text-white bg-charcoal-blue hover:bg-signal-orange hover:border-signal-orange focus:outline-none transition-all shadow-none hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:shadow-none disabled:hover:translate-y-0"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : null}
                                {isLoading ? "CREATING ACCOUNT..." : "SIGN UP"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t-2 border-soft-slate"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-4 bg-white text-xs font-bold text-steel-gray uppercase tracking-widest">Or sign up with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleGoogleSignIn}
                                className="w-full inline-flex justify-center py-3 px-4 border-2 border-soft-slate bg-white text-sm font-bold text-charcoal-blue hover:bg-off-white hover:border-charcoal-blue hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-wide"
                                title="Use Google Sign In"
                            >
                                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                                    />
                                </svg>
                                Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 
        Right Section - Image Layer (Absolute)
        Using clip-path for mirrored diagonal.
      */}
            <div
                className="hidden lg:block absolute top-0 right-0 w-[60%] h-full z-0 bg-charcoal-blue"
                style={{
                    clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)"
                }}
            >
                <div
                    className="w-full h-full bg-cover bg-center opacity-50 mix-blend-overlay"
                    style={{ backgroundImage: "url('/dispatch_bg.png')" }}
                />
                <div className="absolute inset-0 bg-linear-to-l from-charcoal-blue/90 to-signal-orange/40" />

                <div className="absolute bottom-20 right-12 text-white max-w-md text-right p-8">
                    <h2 className="text-4xl font-bold mb-4 font-sans tracking-tight">Join EventOps</h2>
                    <p className="text-lg text-gray-200 leading-relaxed">
                        Create experiences that matter. Start organizing your events today.
                    </p>
                </div>
            </div>
        </div>
    );
}
