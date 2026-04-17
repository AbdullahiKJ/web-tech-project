import {
    PasswordFormSchema,
    PasswordFormState,
    UserFormSchema,
    UserFormState,
} from '@/app/lib/definitions';
import * as z from 'zod';

export async function updateUserNames(
    state: UserFormState,
    formData: FormData,
) {
    // Validate form fields
    const validatedFields = UserFormSchema.safeParse({
        name: formData.get('name'),
        display_name: formData.get('display_name'),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: z.treeifyError(validatedFields.error).properties,
        };
    }

    // Prepare data for insertion into database
    const { name, display_name } = validatedFields.data;

    const options: RequestInit = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, display_name }),
        cache: 'no-store',
    };

    try {
        // todo: replace this with the user id
        const path = 'http://localhost:8080/users/name/1';
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
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: z.treeifyError(validatedFields.error).properties,
        };
    }

    // Prepare data for insertion into database
    const { existing_password, password } = validatedFields.data;

    const options: RequestInit = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ existing_password, password }),
        cache: 'no-store',
    };

    try {
        // todo: replace this with the user id
        const path = 'http://localhost:8080/users/password/1';
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
