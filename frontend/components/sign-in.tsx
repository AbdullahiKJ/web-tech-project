'use client';

import Link from 'next/link';
import { signin } from '@/app/actions/auth';
import { useActionState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/app/providers/AuthProvider';

export default function SignIn() {
    const authContext = useContext(AuthContext);
    const [state, action, pending] = useActionState(signin, undefined);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            authContext?.refreshUser();
            router.push('/featured');
        }
    }, [state, router]);

    return (
        <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center">
            <div className="flex w-104 flex-col gap-5 rounded-xl border p-1.5">
                <div className="flex flex-col gap-5 rounded-xl border p-10">
                    <h1 className="text-xl font-semibold">Sign In</h1>
                    <p className="text-sm">
                        Welcome back! Please sign in to continue.
                    </p>
                    <form className="flex flex-col gap-2" action={action}>
                        {/* Email */}
                        <label htmlFor="email" className="text-sm">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            className="w-full rounded border p-1"
                            type="email"
                        />
                        {state?.errors?.email && (
                            <p className="text-sm text-red-500">
                                {state.errors.email.errors[0]}
                            </p>
                        )}

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="text-sm">
                                Password
                            </label>
                            <Link
                                href="/forgot-password"
                                className="float-right text-sm text-teal-700"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            id="password"
                            name="password"
                            className="w-full rounded border p-1"
                            type="password"
                        />
                        {state?.errors?.password && (
                            <p className="text-sm text-red-500">
                                {state.errors.password.errors[0]}
                            </p>
                        )}

                        <button className="btn mt-6 btn-outline">
                            Continue
                        </button>
                    </form>
                </div>
                <div className="flex justify-center px-10 pb-2">
                    <p className="text-sm">
                        Don't have an account?{' '}
                        <Link href="/sign-up" className="text-teal-700">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
