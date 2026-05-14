export type ToastProps = {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
};

export default function Toast({ message, type = 'success' }: ToastProps) {
    return (
        <div className="toast toast-center toast-top">
            <div className={`alert alert-${type}`}>
                <span>{message}</span>
            </div>
        </div>
    );
}
