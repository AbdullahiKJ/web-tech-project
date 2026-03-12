import * as z from 'zod'
 
export const SignupFormSchema = z.object({
    name: z
        .string()
        .min(2, { error: 'Name must be at least 2 characters long.' })
        .trim(),
    email: z
        .email({ error: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .min(8, { error: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
        .regex(/[0-9]/, { error: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, { error: 'Contain at least one special character.' })
        .trim(),
    confirmPassword: z
        .string()
        .min(1, { error: 'Please confirm your password.' })
        .trim(),
    }).refine((values) => values.password === values.confirmPassword, { error: 'Passwords do not match.', path: ["confirmPassword"] })
 
export type SignupFormState =
   {
      errors?: {
        name?: {
            errors: string[];
        } | undefined;
        email?: {
            errors: string[];
        } | undefined;
        password?: {
            errors: string[];
        } | undefined;
        confirmPassword?: {
            errors: string[];
        } | undefined;
      }
    }
    | undefined

export const ReviewFormSchema = z.object({
    rating: z
        .number()
        .min(0, { error: 'Rating must be at least 0.' })
        .max(5, { error: 'Rating must be at most 5.' }),
    review_description: z
        .string()
        .min(10, { error: 'Review must be at least 10 characters long.' })
        .max(200, { error: 'Review must be at most 200 characters long.' }),
    movie_id: z
        .string()
        .min(1, { error: 'Movie ID is required.' }),
    user_id: z
        .string()
        .min(1, { error: 'User ID is required.' }),})

export type ReviewFormState = {
    errors?: {
        rating?: {
            errors: string[];
        } | undefined;
        review_description?: {
            errors: string[];
        } | undefined;
        movie_id?: {
            errors: string[];
        } | undefined;
        user_id?: {
            errors: string[];
        } | undefined;
    }
} | undefined