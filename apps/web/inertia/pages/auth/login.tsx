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
				eyebrow="Content de vous revoir"
				title="Retrouvez vos trajets partout."
				description="Connectez-vous pour préparer la synchronisation de vos favoris et de vos préférences Limopti."
				footer={
					<>
						Pas encore de compte ?{' '}
						<Link route="new_account.create" className="text-accent hover:text-accent-hover font-semibold">
							Créer un compte
						</Link>
					</>
				}
			>
				<div className="mb-7">
					<h2 className="text-ink text-2xl font-bold tracking-tight">Connexion</h2>
					<p className="text-muted mt-2 text-sm">Saisissez vos identifiants pour continuer.</p>
				</div>

				<Form route="session.store">
					{({ errors, processing }) => (
						<div className="space-y-5">
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
