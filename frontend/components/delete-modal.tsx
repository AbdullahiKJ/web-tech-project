'use client';

import { forwardRef, useRef } from 'react';

interface Props {
    reviewId?: string;
    onConfirm: (data: string | undefined) => Promise<void>;
    children: React.ReactNode;
}

export const DeleteModal = forwardRef<HTMLDialogElement, Props>(
    ({ onConfirm, reviewId, children }, ref) => {
        const dialogRef = useRef<HTMLDialogElement>(null);

        function handleOpenModal() {
            // Show the modal
            // (document.getElementById((props?.reviewId ?? '') + 'delete') as HTMLDialogElement | null)?.showModal();
            dialogRef.current?.showModal();
        }

        function handleCloseModal() {
            dialogRef.current?.close();
        }

        return (
            <>
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <button className="cursor-pointer" onClick={handleOpenModal}>
                    {children}
                </button>
                <dialog
                    ref={dialogRef}
                    data-testid={reviewId + 'delete'}
                    className="modal modal-bottom sm:modal-middle"
                >
                    <div className="modal-box">
                        <h3 className="text-lg font-bold">Delete Review</h3>
                        <p className="py-4">
                            Are you sure you want to delete this review?
                        </p>
                        <div className="modal-action">
                            <form method="dialog">
                                <button
                                    className="btn mr-2 btn-soft btn-error"
                                    onClick={() => onConfirm(reviewId)}
                                >
                                    Delete
                                </button>
                                {/* Close the modal */}
                                <button
                                    className="btn"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                    {/* Close by clicking outside the modal area */}
                    <form method="dialog" className="modal-backdrop">
                        <button />
                    </form>
                </dialog>
            </>
        );
    },
);
