import {
    PasswordFormSchema,
    PasswordFormState,
    UserFormSchema,
    UserFormState,
} from '@/app/lib/definitions';
import { use } from 'react';
import * as z from 'zod';

export async function updateUserNames(
    state: UserFormState,
    formData: FormData,
) {
    // Validate form fields
    const validatedFields = UserFormSchema.safeParse({
        name: formData.get('name'),
        display_name: formData.get('display_name'),
        user_id: formData.get('user_id'),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: z.treeifyError(validatedFields.error).properties,
        };
    }

    // Prepare data for insertion into database
    const { name, display_name, user_id } = validatedFields.data;

    const options: RequestInit = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, display_name }),
        cache: 'no-store',
    };

    try {
        const path = `http://localhost:8080/users/name/${user_id}`;
        const res = await fetch(path, options);
        if (!res.ok) {
            const text = await res.text();
            return { apiError: text };
        } else {
            // Redirect to the home page after successful signup
            return {
                success: true,
            };
        }
    } catch (err) {
        console.error('Network error', err);
        return { apiError: 'Network error' };
    }
}

export async function updateUserPassword(
    state: PasswordFormState,
    formData: FormData,
) {
    // Validate form fields
    const validatedFields = PasswordFormSchema.safeParse({
        existing_password: formData.get('existing_password'),
        password: formData.get('password'),
        confirm_password: formData.get('confirm_password'),
        user_id: formData.get('user_id'),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: z.treeifyError(validatedFields.error).properties,
        };
    }

    // Prepare data for insertion into database
    const { existing_password, password, user_id } = validatedFields.data;

    const options: RequestInit = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ existing_password, password }),
        cache: 'no-store',
    };

    try {
        const path = `http://localhost:8080/users/password/${user_id}`;
        const res = await fetch(path, options);
        if (!res.ok) {
            const text = await res.text();
            return { apiError: text };
        } else {
            // Redirect to the home page after successful signup
            return {
                success: true,
            };
        }
    } catch (err) {
        console.error('Network error', err);
        return { apiError: 'Network error' };
    }
}
