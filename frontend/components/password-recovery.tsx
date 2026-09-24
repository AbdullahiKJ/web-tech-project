'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

export default function PasswordRecovery({
    reset = false,
}: {
    reset?: boolean;
}) {
    const [token, setToken] = useState('');
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (reset) {
            setToken(
                new URLSearchParams(window.location.hash.slice(1)).get(
                    'token',
                ) ?? '',
            );
        }
    }, [reset]);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (pending) return;
        setError('');
        const form = new FormData(event.currentTarget);
        const password = String(form.get('password') ?? '');
        const confirmPassword = String(form.get('confirmPassword') ?? '');
        if (
            reset &&
            (!/[a-zA-Z]/.test(password) ||
                !/[0-9]/.test(password) ||
                !/[^a-zA-Z0-9]/.test(password) ||
                new TextEncoder().encode(password).length > 72)
        ) {
            setError(
                'Use a letter, number and special character, with no more than 72 bytes.',
            );
            return;
        }
        if (reset && password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setPending(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/${reset ? 'reset-password' : 'forgot-password'}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        reset
                            ? { token, password, confirmPassword }
                            : { email: String(form.get('email') ?? '').trim() },
                    ),
                },
            );
            const data = await response.json().catch(() => null);
            if (!response.ok) {
                setError(
                    typeof data?.messages?.error === 'string'
                        ? data.messages.error
                        : 'Unable to complete your request. Please try again.',
                );
                return;
            }
            setMessage(
                reset
                    ? 'Your password has been reset. You can now sign in.'
                    : 'If an account exists with that email, a password reset link will be sent. Check your inbox and spam folder.',
            );
            if (reset)
                window.history.replaceState(null, '', window.location.pathname);
        } catch {
            setError(
                'Unable to connect. Please check your connection and try again.',
            );
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-4">
            <div className="flex w-full max-w-104 flex-col gap-5 rounded-xl border p-1.5">
                <div className="flex flex-col gap-5 rounded-xl border p-10">
                    <h1 className="text-xl font-semibold">
                        {reset ? 'Reset password' : 'Forgot password?'}
                    </h1>
                    {message ? (
                        <p role="status" className="text-sm">
                            {message}
                        </p>
                    ) : (
                        <>
                            <p className="text-sm">
                                {reset
                                    ? 'Choose a new password for your account.'
                                    : 'Enter your email address and we will send you a password reset link.'}
                            </p>
                            {reset && !token ? (
                                <p role="alert" className="text-sm">
                                    This reset link is missing a token.{' '}
                                    <Link
                                        className="text-teal-700"
                                        href="/forgot-password"
                                    >
                                        Request a new link
                                    </Link>
                                    .
                                </p>
                            ) : (
                                <form
                                    onSubmit={submit}
                                    className="flex flex-col gap-2"
                                >
                                    {reset ? (
                                        <>
                                            <label
                                                htmlFor="password"
                                                className="text-sm"
                                            >
                                                New password
                                            </label>
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                autoComplete="new-password"
                                                required
                                                minLength={8}
                                                maxLength={72}
                                                aria-describedby="password-help"
                                                className="w-full rounded border p-1"
                                            />
                                            <p
                                                id="password-help"
                                                className="text-sm"
                                            >
                                                Use at least 8 characters,
                                                including a letter, number and
                                                special character.
                                            </p>
                                            <label
                                                htmlFor="confirmPassword"
                                                className="text-sm"
                                            >
                                                Confirm password
                                            </label>
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                autoComplete="new-password"
                                                required
                                                minLength={8}
                                                maxLength={72}
                                                className="w-full rounded border p-1"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <label
                                                htmlFor="email"
                                                className="text-sm"
                                            >
                                                Email
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                maxLength={254}
                                                className="w-full rounded border p-1"
                                            />
                                        </>
                                    )}
                                    {error && (
                                        <p
                                            role="alert"
                                            className="text-sm text-red-500"
                                        >
                                            {error}
                                        </p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={pending}
                                        className="btn mt-6 btn-outline"
                                    >
                                        {pending
                                            ? 'Please wait…'
                                            : reset
                                              ? 'Reset password'
                                              : 'Send reset link'}
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>
                <div className="flex justify-center px-10 pb-2">
                    <Link href="/sign-in" className="text-sm text-teal-700">
                        Back to sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
