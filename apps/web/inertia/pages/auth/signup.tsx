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
				eyebrow="Votre mobilité, à votre façon"
				title="Épinglez les trajets qui comptent."
				description="Créez votre compte Limopti pour retrouver bientôt vos favoris et alertes sur tous vos appareils."
				footer={
					<>
						Vous avez déjà un compte ?{' '}
						<Link route="session.create" className="text-accent hover:text-accent-hover font-semibold">
							Se connecter
						</Link>
					</>
				}
			>
				<div className="mb-7">
					<h2 className="text-ink text-2xl font-bold tracking-tight">Créer mon compte</h2>
					<p className="text-muted mt-2 text-sm">Quelques informations suffisent pour commencer.</p>
				</div>

				<Form route="new_account.store">
					{({ errors, processing }) => (
						<div className="space-y-5">
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
