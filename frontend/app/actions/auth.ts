import {
    SigninFormSchema,
    SigninFormState,
    SignupFormSchema,
    SignupFormState,
} from '@/app/lib/definitions';
import * as z from 'zod';

export async function signup(state: SignupFormState, formData: FormData) {
    // Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirm-password'),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: z.treeifyError(validatedFields.error).properties,
        };
    }

    // Prepare data for insertion into database
    const { name, email, password } = validatedFields.data;

    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
        cache: 'no-store',
    };

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users`,
            options,
        );
        if (!res.ok) {
            const text = await res.text();
            return { apiError: text };
        } else {
            // Create session for the user
            const sessionOptions: RequestInit = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            };
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
                sessionOptions,
            );

            if (!res.ok) {
                const text = await res.text();
                return { apiError: text };
            } else {
                // Redirect to the home page after successful signup
                return { success: true };
            }
        }
    } catch (err) {
        console.error('Network error during sign up', err);
        return { apiError: 'Network error' };
    }
}

export async function signin(state: SigninFormState, formData: FormData) {
    // Validate form fields
    const validatedFields = SigninFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: z.treeifyError(validatedFields.error).properties,
        };
    }

    // Prepare data for the login request
    const { email, password } = validatedFields.data;

    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        cache: 'no-store',
        credentials: 'include',
    };

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            options,
        );
        if (!res.ok) {
            const text = await res.text();
            return { apiError: text };
        } else {
            // Redirect to the home page after successful signup
            return { success: true };
        }
    } catch (err) {
        console.error('Network error during sign in', err);
        return { apiError: 'Network error' };
    }
}

export async function getCurrentUser() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        credentials: 'include',
        cache: 'no-store',
    });

    if (!res.ok) return null;

    return res.json();
}

export async function refreshSession() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/timeout`, {
        credentials: 'include',
        cache: 'no-store',
    });

    return res.ok;
}
