import { Head } from '@inertiajs/react';
import { ErrorPage } from '~/components/error-page';

export default function ServerError() {
	return (
		<>
			<Head title="Une erreur est survenue" />
			<ErrorPage
				status="500"
				title="Une erreur est survenue"
				description="La requête n’a pas pu aboutir. Réessayez dans un instant."
			/>
		</>
	);
}
