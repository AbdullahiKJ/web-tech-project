export default function Navbar() {
	return (
		<div className="flex flex-col">
			<div className="flex flex-row justify-center py-8 px-8 gap-8">
				<p>Website Logo</p>
				<form className="grow flex">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
						/>
					</svg>

					<input
						className="form-control w-full"
						type="search"
						placeholder="Search"
					/>
				</form>
				<p>User</p>
			</div>
			<div className="flex flex-row justify-center gap-20">
				<p>Header 1</p>
				<p>Header 2</p>
				<p>Header 3</p>
				<p>Header 4</p>
			</div>
		</div>
	);
}
