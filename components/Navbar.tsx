export default function Navbar() {
	return (
		<div className="flex flex-col">
			<div className="flex flex-row justify-center py-8 px-8 gap-8">
				<p className="text-xl">Website Title/Logo</p>
				<div className="grow flex justify-center">
					<form className="flex w-md">
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
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="currentColor"
					className="size-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
					/>
				</svg>
			</div>
			<div className="flex flex-row justify-center gap-20">
				<p className="text-center text-lg pb-3">Profile</p>
				<p className="text-center text-lg pb-3">Featured</p>
				<p className="text-center text-lg pb-3">Upcoming</p>
			</div>
		</div>
	);
}
