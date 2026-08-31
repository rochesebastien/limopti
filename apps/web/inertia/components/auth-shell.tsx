import { type ReactNode } from 'react';

interface AuthShellProps {
	title: string;
	description: string;
	children: ReactNode;
	footer: ReactNode;
}

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
	return (
		<main className="mx-auto flex w-full max-w-sm flex-col justify-center px-4 py-16">
			<header className="mb-6">
				<h1 className="text-ink text-xl font-semibold">{title}</h1>
				<p className="text-muted mt-1 text-sm">{description}</p>
			</header>

			{children}

			<p className="text-muted mt-6 text-center text-sm">{footer}</p>
		</main>
	);
}
