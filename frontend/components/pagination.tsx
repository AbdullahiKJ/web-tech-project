interface Props {
    index: number;
    count: number;
    onPageChange?: (page: number) => void;
}
export default function Pagination({ index, count, onPageChange }: Props) {
    function handlePageChange(forward: boolean) {
        const page = forward ? index + 1 : index - 1;
        if (page < 1 || page > count) return;
        onPageChange?.(page);
    }

    return (
        <div className="join justify-self-center">
            <button
                className={`btn join-item ${index == 1 ? 'btn-disabled' : ''}`}
                onClick={() => handlePageChange(false)}
                disabled={index == 1}
            >
                «
            </button>
            <button className="btn join-item">Page {index}</button>
            <button
                className={`btn join-item ${index == count ? 'btn-disabled' : ''}`}
                onClick={() => handlePageChange(true)}
                disabled={index == count}
            >
                »
            </button>
        </div>
    );
}
