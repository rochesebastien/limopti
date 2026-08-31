import { type Data } from '@generated/data';
import { Head } from '@inertiajs/react';
import { type InertiaProps } from '~/types';

type PageProps = InertiaProps<{ account: Data.Identity.AccountDetails }>;

export default function ShowAccount({ account, user }: PageProps) {
	const displayName = account.name ?? account.email;

	return (
		<>
			<Head title="Mon compte" />
			<main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
				<h1 className="text-ink text-xl font-semibold">Compte</h1>

				<section className="border-border rounded-card mt-6 border">
					<div className="border-border flex items-center gap-3 border-b px-4 py-4">
						<span className="border-border text-ink grid size-10 shrink-0 place-items-center rounded-full border text-sm font-medium">
							{user?.initials}
						</span>
						<div className="min-w-0">
							<h2 className="text-ink truncate text-sm font-medium">{displayName}</h2>
							<p className="text-positive inline-flex items-center gap-1.5 text-xs">
								<span className="bg-positive size-1.5 rounded-full" aria-hidden="true" />
								Compte actif
							</p>
						</div>
					</div>

					<dl className="divide-border divide-y">
						<div className="flex items-baseline justify-between gap-4 px-4 py-3">
							<dt className="text-muted text-xs">Adresse e-mail</dt>
							<dd className="text-ink text-sm break-all">{account.email}</dd>
						</div>
						<div className="flex items-baseline justify-between gap-4 px-4 py-3">
							<dt className="text-muted text-xs">Membre depuis</dt>
							<dd className="text-ink text-sm">
								{new Date(account.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
							</dd>
						</div>
					</dl>
				</section>
			</main>
		</>
	);
}
