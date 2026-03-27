'use client';

import { useSearchParams } from 'next/navigation';

export default function Home() {
    const searchParams = useSearchParams();
    const query = searchParams.get('query');
    return <div>{query}</div>;
}
