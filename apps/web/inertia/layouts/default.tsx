import { Form, Link } from '@adonisjs/inertia/react';
import { usePage } from '@inertiajs/react';
import { Button } from '@limopti/design-system/button';
import { BusFront, LogOut, Route, Star, TriangleAlert } from 'lucide-react';
import { type ReactElement, useEffect } from 'react';
import { toast, Toaster } from 'sonner';

const NAVIGATION = [
	{ route: 'home', label: 'Itinéraires', short: 'Trajet', icon: Route, match: (url: string) => url === '/' },
	{
		route: 'lines.index',
		label: 'Lignes',
		short: 'Lignes',
		icon: BusFront,
		match: (url: string) => url.startsWith('/lines'),
	},
	{
		route: 'favorites.index',
		label: 'Favoris',
		short: 'Favoris',
		icon: Star,
		match: (url: string) => url.startsWith('/favorites'),
	},
	{
		route: 'traffic.index',
		label: 'Trafic',
		short: 'Trafic',
		icon: TriangleAlert,
		match: (url: string) => url.startsWith('/traffic'),
	},
] as const;

function Brand() {
	return (
		<span className="flex items-center gap-2">
			<span className="bg-accent text-accent-ink grid size-6 place-items-center rounded-md text-xs font-semibold">
				L
			</span>
			<span className="text-ink text-[0.9375rem] font-semibold">Limopti</span>
		</span>
	);
}

export default function Layout({ children }: { children: ReactElement }) {
	const { url, flash, props } = usePage();
	const isAuthPage = url.startsWith('/login') || url.startsWith('/signup');

	useEffect(() => {
		toast.dismiss();
	}, [url]);

	useEffect(() => {
		if (flash.error) {
			toast.error(flash.error);
		}

		if (flash.success) {
			toast.success(flash.success);
		}
	}, [flash.error, flash.success]);

	return (
		<div className="bg-canvas text-ink min-h-dvh">
			<header className="border-border bg-canvas/80 sticky top-0 z-50 border-b backdrop-blur-xl">
				<div className="mx-auto flex h-14 max-w-[1600px] items-center gap-6 px-4 sm:px-5">
					<Link route="home" aria-label="Accueil Limopti" className="shrink-0">
						<Brand />
					</Link>

					{!isAuthPage ? (
						<nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
							{NAVIGATION.map((item) => {
								const active = item.match(url);

								return (
									<Link
										key={item.route}
										route={item.route}
										aria-current={active ? 'page' : undefined}
										className={`rounded-md px-2.5 py-1.5 text-sm transition-colors ${
											active ? 'text-ink font-medium' : 'text-muted hover:text-ink'
										}`}
									>
										{item.label}
									</Link>
								);
							})}
						</nav>
					) : null}

					<div className="ml-auto flex items-center gap-1.5">
						{!isAuthPage ? (
							<Link
								route="sources.index"
								className={`hidden rounded-md px-2.5 py-1.5 text-sm transition-colors sm:block ${
									url.startsWith('/sources') ? 'text-ink font-medium' : 'text-muted hover:text-ink'
								}`}
							>
								Sources
							</Link>
						) : null}

						{props.authEnabled && props.user ? (
							<>
								<Link
									route="account.show"
									className="border-border text-ink hover:bg-surface-muted grid size-8 place-items-center rounded-full border text-xs font-medium transition-colors"
									aria-label="Ouvrir mon compte"
								>
									{props.user.initials}
								</Link>
								<Form route="session.destroy" className="hidden sm:block">
									<Button type="submit" intent="ghost" size="small" aria-label="Se déconnecter">
										<LogOut className="size-4" aria-hidden="true" />
									</Button>
								</Form>
							</>
						) : null}

						{props.authEnabled && !props.user && !isAuthPage ? (
							<Button asChild intent="secondary" size="small">
								<Link route="session.create">Connexion</Link>
							</Button>
						) : null}
					</div>
				</div>
			</header>

			<div className={!isAuthPage ? 'min-h-[calc(100dvh-3.5rem)] pb-14 md:pb-0' : 'min-h-[calc(100dvh-3.5rem)]'}>
				{children}
			</div>

			{!isAuthPage ? (
				<nav
					className="border-border bg-canvas/95 fixed inset-x-0 bottom-0 z-40 flex border-t px-2 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden"
					aria-label="Navigation mobile"
				>
					{NAVIGATION.map((item) => {
						const active = item.match(url);
						const Icon = item.icon;

						return (
							<Link
								key={item.route}
								route={item.route}
								aria-current={active ? 'page' : undefined}
								className={`flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 text-[0.6875rem] transition-colors ${
									active ? 'text-ink font-medium' : 'text-muted'
								}`}
							>
								<Icon className="size-[1.125rem]" aria-hidden="true" />
								{item.short}
							</Link>
						);
					})}
				</nav>
			) : null}

			<Toaster position="top-center" />
		</div>
	);
}
