import { Head } from '@inertiajs/react';
import { ErrorPage } from '~/components/error-page';

export default function NotFound() {
	return (
		<>
			<Head title="Page introuvable" />
			<ErrorPage
				status="404"
				title="Page introuvable"
				description="Cette adresse n’existe pas ou la page a été déplacée."
			/>
		</>
	);
}
