export default function Navbar() {
	return (
		<nav className="nav">
			<div className="container pt-4 px-8 gap-8 mx-8">
				<div className="row">
					<h4 className="col justify-self-start">Website Title/Logo</h4>
					<div className="col flex flex-col gap-3 justify-self-center">
						<form className="d-flex" role="search">
							<input
								className="form-control"
								type="search"
								placeholder="Search"
							/>
						</form>
						<div className="flex flex-row justify-center gap-20">
							<p className="text-center">Profile</p>
							<p className="text-center">Featured</p>
							<p className="text-center">Upcoming</p>
						</div>
					</div>
					<div className="col flex justify-content-end dropdown">
						<button
							className="flex align-content-top dropdown-toggle"
							data-bs-toggle="dropdown"
							type="button"
						>
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
						</button>
						<ul className="dropdown-menu">
							<a className="dropdown-item" href="#">
								Sign In/Out
							</a>
							<a className="dropdown-item" href="#">
								Account Settings
							</a>
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
}
