import { SignupFormSchema, FormState } from "@/app/lib/definitions";
import * as z from 'zod';

export async function signup(state: FormState, formData: FormData) {

    // Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirm-password')
    })
    
    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: z.treeifyError(validatedFields.error).properties
        };
    }

    // Prepare data for insertion into database
    const { name, email, password } = validatedFields.data

    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password }),
        cache: 'no-store'
    };

    try {
        const res = await fetch('http://localhost:8080/users', options);
        if (!res.ok) {
            const text = await res.text();
            return { apiError: text };
        }
        else {
            // Redirect to the home page after successful signup
            return { success: true}
        }
    } catch (err) {
        console.error('Network error during signup', err);
        return { apiError: 'Network error' };
    }
}