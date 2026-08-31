import { Form, Link } from '@adonisjs/inertia/react';
import { Head } from '@inertiajs/react';
import { Button } from '@limopti/design-system/button';
import { Field } from '@limopti/design-system/field';
import { AuthShell } from '~/components/auth-shell';

export default function Signup() {
	return (
		<>
			<Head title="Créer un compte" />
			<AuthShell
				title="Créer un compte"
				description="Quelques informations suffisent pour commencer."
				footer={
					<>
						Vous avez déjà un compte ?{' '}
						<Link route="session.create" className="text-ink underline underline-offset-2 hover:no-underline">
							Se connecter
						</Link>
					</>
				}
			>
				<Form route="new_account.store">
					{({ errors, processing }) => (
						<div className="space-y-4">
							<Field label="Nom" error={errors.name} type="text" name="name" autoComplete="name" required />

							<Field label="Email" error={errors.email} type="email" name="email" autoComplete="email" required />

							<Field
								label="Mot de passe"
								error={errors.password}
								type="password"
								name="password"
								autoComplete="new-password"
								required
							/>

							<Field
								label="Confirmer le mot de passe"
								invalid={Boolean(errors.password)}
								type="password"
								name="passwordConfirmation"
								autoComplete="new-password"
								required
							/>

							<Button type="submit" size="large" loading={processing} className="w-full">
								{processing ? 'Création…' : 'Créer mon compte'}
							</Button>
						</div>
					)}
				</Form>
			</AuthShell>
		</>
	);
}
