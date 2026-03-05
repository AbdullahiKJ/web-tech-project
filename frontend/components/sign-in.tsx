import Link from "next/link";

export default function SignIn() {
    return (
        <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="rounded-xl border flex flex-col gap-5 p-1.5 w-104">
                <div className="rounded-xl border flex flex-col gap-5 p-10">
                    <h1 className="text-xl font-semibold">Sign In</h1>
                    <p className="text-sm">Welcome back! Please sign in to continue.</p>
                    <form className="flex flex-col gap-2">
                        {/* Email */}
                        <label htmlFor="email" className="text-sm">Email</label>
                        <input id="email" name="email" className="border rounded p-1 w-full" type="email"/>
                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="text-sm">Password</label>
                            <Link href="/forgot-password" className="text-teal-700 text-sm float-right">Forgot password?</Link>
                        </div>
                        <input id="password" name="password" className="border rounded p-1 w-full" type="password"/>
                        <button className="bg-white text-black text-sm rounded p-2 w-full mt-6">Continue</button>
                    </form>
                </div>
                <div className="flex justify-center px-10 pb-2">
                    <p className="text-sm">Don't have an account? <Link href="/sign-up" className="text-teal-700">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
}