'use client';

import Link from "next/link";
import {signup} from "@/app/actions/auth";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const [state, action, pending] = useActionState(signup, undefined)
    const router = useRouter();
    
    useEffect(() => {
        if(state?.success)
            router.push('/featured')
    }, [state, router])

    return (
        <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="rounded-xl border flex flex-col gap-5 p-1.5 w-104">
                <div className="rounded-xl border flex flex-col gap-5 p-10">
                    <h1 className="text-xl font-semibold">Create account</h1>
                    <p className="text-sm">Please fill in your details to get started.</p>
                    <form className="flex flex-col gap-2" action={action}>
                        {/* Name */}
                        <label htmlFor="name" className="text-sm">Name</label>
                        <input id="name" name="name" className="border rounded p-1 w-full" type="text" />
                        {state?.errors?.name && <p className="text-sm text-red-500">{state.errors.name.errors[0]}</p>}

                        {/* Email */}
                        <label htmlFor="email" className="text-sm">Email</label>
                        <input id="email" name="email" className="border rounded p-1 w-full" type="email"/>
                        {state?.errors?.email && <p className="text-sm text-red-500">{state.errors.email.errors[0]}</p>}

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="text-sm">Password</label>
                        </div>
                        <input id="password" name="password" className="border rounded p-1 w-full" type="password"/>
                        {state?.errors?.password && (
                            <div>
                            <p className="text-sm text-red-500">Password must:</p>
                            <ul>
                                {state.errors.password.errors.map((error) => (
                                <li key={error} className="text-sm text-red-500">- {error}</li>
                                ))}
                            </ul>
                            </div>
                        )}
                        
                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirm-password" className="text-sm">Confirm Password</label>
                        </div>
                        <input id="confirm-password" name="confirm-password" className="border rounded p-1 w-full" type="password"/>
                        {state?.errors?.confirmPassword && (
                            <ul>
                                {state.errors.confirmPassword.errors.map((error) => (
                                <li key={error} className="text-sm text-red-500">- {error}</li>
                                ))}
                            </ul>
                        )}    
                        {state?.apiError && (
                            <p className="text-sm text-red-500">{state.apiError}</p>
                        )}            

                        {/* Submit button */}
                        <button type="submit" className="bg-white text-black text-sm rounded p-2 w-full mt-6">Continue</button>
                    </form>
                </div>
                <div className="flex justify-center px-10 pb-2">
                    <p className="text-sm">Already have an account? <Link href="/sign-in" className="text-teal-700">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
}