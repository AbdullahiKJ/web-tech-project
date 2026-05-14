import { Suspense } from 'react';
import SearchPageContent from './search-page-content';

export const dynamic = 'force-dynamic';

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}
