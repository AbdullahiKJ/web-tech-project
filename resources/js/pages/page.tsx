import MovieInfo from "@/components/MovieInfo";
import Image from "next/image";
import { ReactElement } from "react";

const rowCount: number = 3;
const colCount: number = 5;

const rows: ReactElement[] = [];
const cols: ReactElement[] = [];
const imageCount = 3;

for (let i = 0; i < colCount; i++) {
	let image = Math.floor(Math.random() * imageCount) + 1;
	cols.push(
		<Image
			className="rounded-xl"
			src={`/poster${image}.jpg`}
			alt={`Poster ${image}`}
			width={250}
			height={20}
			priority
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
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex flex-col items-center justify-between py-8 px-8 bg-white dark:bg-black sm:items-start">
				<MovieInfo imageSrc={2} />
				<div className="flex flex-col">{rows}</div>
			</main>
		</div>
	);
}
