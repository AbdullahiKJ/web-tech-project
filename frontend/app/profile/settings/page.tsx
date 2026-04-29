'use client';

import { updateUserNames, updateUserPassword } from '@/app/actions/users';
import Menu from '@/components/menu';
import PasswordInput from '@/components/password-input';
import Toast, { ToastProps } from '@/components/toast';
import {
    useActionState,
    useState,
    useEffect,
    useCallback,
    useContext,
} from 'react';
import { redirect } from 'next/navigation';
import { AuthContext } from '@/app/providers/AuthProvider';

async function deleteUserAccount() {
    const res = await fetch('http://localhost:8080/users/1', {
        method: 'DELETE',
    });
    if (res.ok) {
        // todo: sign out the user and redirect to the featured page
    }
}

export default function Home() {
    // Redirect to the login page if the user is not authenticated
    const authContext = useContext(AuthContext);
    if (!authContext?.user?.id) {
        redirect('/sign-in');
    }

    const [nameState, nameAction, namePending] = useActionState(
        updateUserNames,
        undefined,
    );
    const [passwordState, passwordAction, passwordPending] = useActionState(
        updateUserPassword,
        undefined,
    );

    const [name, setName] = useState('...');
    const [displayName, setDisplayName] = useState('...');

    const [toast, setToast] = useState<ToastProps | null>(null);

    const fetchUserName = useCallback(async () => {
        // Get the user's name and display name
        const res = await fetch('http://localhost:8080/users/1');
        const json = await res.json();

        setName(json.name);
        setDisplayName(json.display_name);
    }, []);

    // Get the user's name and display name when the component loads
    useEffect(() => {
        fetchUserName();
    }, [fetchUserName]);

    // Refresh name and display name after successful update without refreshing the page, show toast notification
    useEffect(() => {
        if (nameState?.success) {
            fetchUserName();
            setToast({
                message: 'Name/Display Name updated successfully.',
                type: 'success',
            });
        } else if (nameState?.apiError) {
            setToast({
                message: `Error updating name/display name: ${nameState.apiError}`,
                type: 'error',
            });
        }
    }, [nameState, fetchUserName]);

    // Show toast notification after password update attempt
    useEffect(() => {
        if (passwordState?.success) {
            fetchUserName();
            setToast({
                message: 'Password updated successfully.',
                type: 'success',
            });
        } else if (passwordState?.apiError) {
            setToast({
                message: `Error updating password: ${passwordState.apiError}`,
                type: 'error',
            });
        }
    }, [passwordState]);

    // Display toast notification for 3 seconds after it appears
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                setToast(null);
            }, 3000); // 3 seconds

            return () => clearTimeout(timer);
        }
    }, [toast]);

    return (
        <>
            <Menu />
            <div className="p-5">
                <p className="text-3xl">Settings</p>
                <div className="flex flex-col items-center justify-center gap-10 pt-10 sm:flex-row xl:gap-50">
                    {/* Username Section */}
                    <div className="flex flex-col gap-5 bg-base-300 p-10">
                        <p className="text-xl">User Settings</p>
                        <div>
                            <p>Update your personal information.</p>
                            <hr />
                        </div>
                        <form
                            className="flex flex-col gap-5"
                            action={nameAction}
                        >
                            <p>Personal Info</p>
                            {/* Name Input */}
                            <input
                                name="name"
                                className="input"
                                placeholder="Name"
                                defaultValue={name}
                            />
                            {/* Name Errors */}
                            {nameState?.errors?.name && (
                                <p className="text-sm text-red-500">
                                    {nameState.errors.name.errors[0]}
                                </p>
                            )}
                            {/* Display Name Input */}
                            <input
                                name="display_name"
                                className="input"
                                placeholder="Display Name"
                                defaultValue={displayName}
                            />
                            {/* Display Name Errors */}
                            {nameState?.errors?.display_name && (
                                <p className="text-sm text-red-500">
                                    {nameState.errors.display_name.errors[0]}
                                </p>
                            )}
                            <hr />
                            <button className="btn btn-primary" type="submit">
                                Save
                            </button>
                        </form>
                        <hr />
                        <p className="text-xl">Danger Zone</p>
                        {/* Delete account */}
                        <button
                            className="btn btn-error"
                            onClick={() =>
                                (
                                    document.getElementById(
                                        'delete_modal',
                                    ) as HTMLDialogElement | null
                                )?.showModal()
                            }
                        >
                            Delete Account
                        </button>
                        <dialog id="delete_modal" className="modal">
                            <div className="modal-box">
                                <h3 className="text-lg font-bold">Warning!</h3>
                                <p className="py-4">
                                    Are you sure you want to delete your
                                    account? This action cannot be undone.
                                </p>
                                <button
                                    className="btn btn-error"
                                    onClick={deleteUserAccount}
                                >
                                    Delete Account
                                </button>
                            </div>
                            <form method="dialog" className="modal-backdrop">
                                <button>close</button>
                            </form>
                        </dialog>
                    </div>
                    {/* Password Section */}
                    <div className="flex flex-col gap-5 bg-base-300 p-10">
                        <p className="text-xl">Password</p>
                        <div>
                            <p>Manage your password.</p>
                            <hr />
                        </div>
                        <form
                            className="flex flex-col gap-5"
                            action={passwordAction}
                        >
                            <p>Change Password</p>
                            {/* Existing Password Input */}
                            <PasswordInput
                                name="existing_password"
                                placeholder="Existing Password"
                            />
                            {/* Existing Password Errors */}
                            {passwordState?.errors?.existing_password && (
                                <p className="text-sm text-red-500">
                                    {
                                        passwordState.errors.existing_password
                                            .errors[0]
                                    }
                                </p>
                            )}
                            {/* New Password Input */}
                            <PasswordInput
                                name="password"
                                placeholder="New Password"
                            />
                            {/* New Password Errors */}
                            {passwordState?.errors?.password && (
                                <>
                                    <p className="text-sm text-red-500">
                                        Password must:
                                    </p>
                                    <ul>
                                        {passwordState.errors.password.errors.map(
                                            (error) => (
                                                <li
                                                    key={error}
                                                    className="text-sm text-red-500"
                                                >
                                                    - {error}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </>
                            )}
                            {/* Confirm New Password Input */}
                            <PasswordInput
                                name="confirm_password"
                                placeholder="Re-enter New Password"
                            />
                            {/* Confirm New Password Errors */}
                            {passwordState?.errors?.confirm_password && (
                                <p className="text-sm text-red-500">
                                    {
                                        passwordState.errors.confirm_password
                                            .errors[0]
                                    }
                                </p>
                            )}
                            <hr />
                            <button className="btn btn-primary" type="submit">
                                Update Password
                            </button>
                        </form>
                        <hr />
                        <button className="btn btn-error">Sign Out</button>
                    </div>
                </div>
                {/* Display Toast notifications */}
                {toast && <Toast message={toast.message} type={toast.type} />}
            </div>
        </>
    );
}
