import { Form, Link } from '@adonisjs/inertia/react';
import { Head } from '@inertiajs/react';
import { Button } from '@limopti/design-system/button';
import { Field } from '@limopti/design-system/field';
import { AuthShell } from '~/components/auth-shell';

export default function Login() {
	return (
		<>
			<Head title="Connexion" />
			<AuthShell
				title="Connexion"
				description="Saisissez vos identifiants pour continuer."
				footer={
					<>
						Pas encore de compte ?{' '}
						<Link route="new_account.create" className="text-ink underline underline-offset-2 hover:no-underline">
							Créer un compte
						</Link>
					</>
				}
			>
				<Form route="session.store">
					{({ errors, processing }) => (
						<div className="space-y-4">
							<Field label="Email" error={errors.email} type="email" name="email" autoComplete="username" required />

							<Field
								label="Mot de passe"
								error={errors.password}
								type="password"
								name="password"
								autoComplete="current-password"
								required
							/>

							<Button type="submit" size="large" loading={processing} className="w-full">
								{processing ? 'Connexion…' : 'Se connecter'}
							</Button>
						</div>
					)}
				</Form>
			</AuthShell>
		</>
	);
}
