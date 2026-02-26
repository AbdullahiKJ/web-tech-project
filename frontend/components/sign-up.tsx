import Link from "next/link";

export default function SignUp() {
    return (
        <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="rounded-xl border flex flex-col gap-5 p-1.5 w-104">
                <div className="rounded-xl border flex flex-col gap-5 p-10">
                    <h1 className="text-xl font-semibold">Create account</h1>
                    <p className="text-sm">Please fill in your details to get started.</p>
                    <form className="flex flex-col gap-2">
                        {/* Name */}
                        <label htmlFor="name" className="text-sm">Name</label>
                        <input id="name" className="border rounded p-1 w-full" type="text" />
                        {/* Email */}
                        <label htmlFor="email" className="text-sm">Email</label>
                        <input id="email" className="border rounded p-1 w-full" type="email"/>
                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="text-sm">Password</label>
                            <p className="text-xs">Must be at least 12 characters in length</p>
                        </div>
                        <input id="password" className="border rounded p-1 w-full" type="password"/>
                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirm-password" className="text-sm">Confirm Password</label>
                        </div>
                        <input id="confirm-password" className="border rounded p-1 w-full" type="password"/>
                        <button className="bg-white text-black text-sm rounded p-2 w-full mt-6">Continue</button>
                    </form>
                </div>
                <div className="flex justify-center px-10 pb-2">
                    <p className="text-sm">Already have an account? <Link href="/sign-in" className="text-teal-700">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
}