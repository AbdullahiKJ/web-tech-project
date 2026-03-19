'use client'
interface Props {
    reviewId?: string
    onConfirm: ((data: string | undefined) => Promise<void>),
    children: React.ReactNode
}

export default function DeleteModal(props: Props) {
    function handleOpenModal() {
        // Show the modal
        (document.getElementById((props?.reviewId ?? '') + 'delete') as HTMLDialogElement | null)?.showModal();
    }
    
    return (
        <>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <button className="cursor-pointer" onClick={handleOpenModal}>
                {props.children}
            </button>
            <dialog id={props.reviewId + "delete"} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Delete Review</h3>
                    <p className="py-4">Are you sure you want to delete this review?</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button 
                                className="btn btn-soft btn-error mr-2"
                                onClick={() => props.onConfirm(props.reviewId)}
                            >
                                Delete
                            </button>
                            {/* Close the modal */}
                            <button className="btn">Cancel</button>
                        </form>
                    </div>
                </div>
                {/* Close by clicking outside the modal area */}
                <form method="dialog" className="modal-backdrop">
                    <button/>
                </form>
            </dialog>
        </>
    )
}