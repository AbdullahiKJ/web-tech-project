import * as z from 'zod';

export const SignupFormSchema = z
    .object({
        name: z
            .string()
            .min(2, { error: 'Name must be at least 2 characters long.' })
            .trim(),
        email: z.email({ error: 'Please enter a valid email.' }).trim(),
        password: z
            .string()
            .min(8, { error: 'Be at least 8 characters long' })
            .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
            .regex(/[0-9]/, { error: 'Contain at least one number.' })
            .regex(/[^a-zA-Z0-9]/, {
                error: 'Contain at least one special character.',
            })
            .trim(),
        confirmPassword: z
            .string()
            .min(1, { error: 'Please confirm your password.' })
            .trim(),
    })
    .refine((values) => values.password === values.confirmPassword, {
        error: 'Passwords do not match.',
        path: ['confirmPassword'],
    });

export type SignupFormState =
    | {
          errors?: {
              name?:
                  | {
                        errors: string[];
                    }
                  | undefined;
              email?:
                  | {
                        errors: string[];
                    }
                  | undefined;
              password?:
                  | {
                        errors: string[];
                    }
                  | undefined;
              confirmPassword?:
                  | {
                        errors: string[];
                    }
                  | undefined;
          };
      }
    | undefined;

export const SigninFormSchema = z.object({
    email: z.email({ error: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .min(1, { error: 'Please enter your password.' })
        .trim(),
});

export type SigninFormState =
    | {
          errors?: {
              email?:
                  | {
                        errors: string[];
                    }
                  | undefined;
              password?:
                  | {
                        errors: string[];
                    }
                  | undefined;
          };
      }
    | undefined;

export const ReviewFormSchema = z.object({
    rating: z
        .number()
        .min(0, { error: 'Rating must be at least 0.' })
        .max(5, { error: 'Rating must be at most 5.' }),
    review_description: z
        .string()
        .min(10, { error: 'Review must be at least 10 characters long.' })
        .max(200, { error: 'Review must be at most 200 characters long.' }),
    movie_id: z.string().min(1, { error: 'Movie ID is required.' }),
    user_id: z.string().min(1, { error: 'User ID is required.' }),
    review_id: z.string().min(0),
});

export type ReviewFormState =
    | {
          errors?: {
              rating?:
                  | {
                        errors: string[];
                    }
                  | undefined;
              review_description?:
                  | {
                        errors: string[];
                    }
                  | undefined;
              movie_id?:
                  | {
                        errors: string[];
                    }
                  | undefined;
              user_id?:
                  | {
                        errors: string[];
                    }
                  | undefined;
          };
      }
    | undefined;

export const UserFormSchema = z.object({
    name: z.string().min(1, { error: 'Name is required.' }),
    display_name: z.string().min(1, { error: 'Display Name is required.' }),
});

export type UserFormState =
    | {
          errors?: {
              name?:
                  | {
                        errors: string[];
                    }
                  | undefined;
              display_name?:
                  | {
                        errors: string[];
                    }
                  | undefined;
          };
      }
    | undefined;

export const PasswordFormSchema = z
    .object({
        existing_password: z
            .string()
            .min(1, { error: 'Please enter your password' })
            .trim(),
        password: z
            .string()
            .min(8, { error: 'Be at least 8 characters long' })
            .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
            .regex(/[0-9]/, { error: 'Contain at least one number.' })
            .regex(/[^a-zA-Z0-9]/, {
                error: 'Contain at least one special character.',
            })
            .trim(),
        confirm_password: z
            .string()
            .min(1, { error: 'Please confirm your password.' })
            .trim(),
    })
    .refine((values) => values.password === values.confirm_password, {
        error: 'Passwords do not match.',
        path: ['confirm_password'],
    });

export type PasswordFormState =
    | {
          errors?: {
              existing_password?:
                  | {
                        errors: string[];
                    }
                  | undefined;
              password?:
                  | {
                        errors: string[];
                    }
                  | undefined;
              confirm_password?:
                  | {
                        errors: string[];
                    }
                  | undefined;
          };
      }
    | undefined;

export type Movie = {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: string;
    budget: number;
    genres: {
        id: number;
        name: string;
    }[];
    homepage: string;
    id: number;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: {
        id: number;
        logo_path: string;
        name: string;
        origin_country: string;
    }[];
    production_countries: {
        iso_3166_1: string;
        name: string;
    }[];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: {
        english_name: string;
        iso_639_1: string;
        name: string;
    }[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
};
