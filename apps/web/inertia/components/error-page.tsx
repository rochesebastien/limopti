import { Link } from '@adonisjs/inertia/react';
import { Button } from '@limopti/design-system/button';

interface ErrorPageProps {
	status: '404' | '500';
	title: string;
	description: string;
}

export function ErrorPage({ status, title, description }: ErrorPageProps) {
	return (
		<main className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-md items-center px-4">
			<div className="w-full text-center">
				<p className="text-faint text-xs tabular-nums">Erreur {status}</p>
				<h1 className="text-ink mt-2 text-xl font-semibold">{title}</h1>
				<p className="text-muted mx-auto mt-2 max-w-sm text-sm leading-6">{description}</p>
				<Button asChild intent="secondary" size="small" className="mt-6">
					<Link route="home">Retour à l’accueil</Link>
				</Button>
			</div>
		</main>
	);
}
