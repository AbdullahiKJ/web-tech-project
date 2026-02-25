import MovieModal from '@/components/movie-modal';
import { ReactElement } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { home } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Featured',
        href: home().url,
    },
];

const rowCount: number = 3;
const colCount: number = 5;

const rows: ReactElement[] = [];
const cols: ReactElement[] = [];
const imageCount = 3;

for (let i = 0; i < colCount; i++) {
    let image = Math.floor(Math.random() * imageCount) + 1;
    cols.push(
        <img
            className="rounded-xl"
            src={`/poster${image}.jpg`}
            alt={`Poster ${image}`}
            width={225}
            height={20}
            key={i}
        />,
    );
}
for (let i = 0; i < rowCount; i++) {
    rows.push(
        <div className="flex gap-5 py-4" key={i}>
            {cols}
        </div>,
    );
}

export default function Home() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Featured" />
            <main className="flex flex-col items-center justify-between px-8 py-8">
                <MovieModal imageSrc={2} />
                <div className="flex flex-col">{rows}</div>
            </main>
        </AppLayout>
    );
}