import { Form, Link } from '@adonisjs/inertia/react';
import { usePage } from '@inertiajs/react';
import { Button } from '@limopti/design-system/button';
import { BusFront, CircleUserRound, LogOut, Route, Star, TriangleAlert } from 'lucide-react';
import { type ReactElement, useEffect } from 'react';
import { toast, Toaster } from 'sonner';

function Brand() {
	return (
		<span className="flex items-center gap-2.5">
			<span className="bg-brand-lime text-brand-navy grid size-9 place-items-center rounded-xl font-black shadow-sm">
				L
			</span>
			<span className="text-ink text-lg font-black tracking-[-0.035em]">Limopti</span>
		</span>
	);
}

function DesktopNavigation({ url }: { url: string }) {
	const linkClass = (active: boolean) =>
		`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
			active ? 'bg-accent-soft text-accent' : 'text-muted hover:bg-surface-muted hover:text-ink'
		}`;

	return (
		<nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
			<Link route="home" className={linkClass(url === '/')} aria-current={url === '/' ? 'page' : undefined}>
				Itinéraires
			</Link>
			<Link
				route="lines.index"
				className={linkClass(url.startsWith('/lines'))}
				aria-current={url.startsWith('/lines') ? 'page' : undefined}
			>
				Lignes
			</Link>
			<Link
				route="favorites.index"
				className={linkClass(url.startsWith('/favorites'))}
				aria-current={url.startsWith('/favorites') ? 'page' : undefined}
			>
				Favoris
			</Link>
			<Link
				route="traffic.index"
				className={linkClass(url.startsWith('/traffic'))}
				aria-current={url.startsWith('/traffic') ? 'page' : undefined}
			>
				Info trafic
			</Link>
		</nav>
	);
}

function MobileNavigation({ url }: { url: string }) {
	const itemClass = (active: boolean) =>
		`flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[0.68rem] font-bold transition-colors ${
			active ? 'text-accent' : 'text-muted'
		}`;

	return (
		<nav
			className="border-border bg-surface/96 fixed inset-x-0 bottom-0 z-40 flex border-t px-2 pt-1.5 pb-[max(0.35rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden"
			aria-label="Navigation mobile"
		>
			<Link route="home" className={itemClass(url === '/')} aria-current={url === '/' ? 'page' : undefined}>
				<Route className="size-5" aria-hidden="true" />
				Itinéraire
			</Link>
			<Link
				route="lines.index"
				className={itemClass(url.startsWith('/lines'))}
				aria-current={url.startsWith('/lines') ? 'page' : undefined}
			>
				<BusFront className="size-5" aria-hidden="true" />
				Lignes
			</Link>
			<Link
				route="favorites.index"
				className={itemClass(url.startsWith('/favorites'))}
				aria-current={url.startsWith('/favorites') ? 'page' : undefined}
			>
				<Star className="size-5" aria-hidden="true" />
				Favoris
			</Link>
			<Link
				route="traffic.index"
				className={itemClass(url.startsWith('/traffic'))}
				aria-current={url.startsWith('/traffic') ? 'page' : undefined}
			>
				<TriangleAlert className="size-5" aria-hidden="true" />
				Trafic
			</Link>
		</nav>
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
			<header className="border-border bg-surface/95 sticky top-0 z-50 border-b backdrop-blur-xl">
				<div className="mx-auto flex h-16 max-w-[1600px] items-center gap-7 px-4 sm:px-6">
					<Link route="home" aria-label="Accueil Limopti" className="shrink-0">
						<Brand />
					</Link>

					{!isAuthPage ? <DesktopNavigation url={url} /> : null}

					<div className="ml-auto flex items-center gap-2">
						{!isAuthPage ? (
							<Link
								route="sources.index"
								className="border-border bg-surface text-muted hover:text-ink hidden h-9 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-colors lg:flex"
							>
								<span className="relative flex size-2">
									<span className="bg-warning absolute inline-flex size-full animate-ping rounded-full opacity-40" />
									<span className="bg-warning relative inline-flex size-2 rounded-full" />
								</span>
								Horaires théoriques
							</Link>
						) : null}

						{props.user ? (
							<>
								<Link
									route="account.show"
									className="bg-accent-soft text-accent grid size-10 place-items-center rounded-xl text-xs font-black"
									aria-label="Ouvrir mon compte"
								>
									{props.user.initials}
								</Link>
								<Form route="session.destroy" className="hidden sm:block">
									<Button type="submit" intent="secondary" size="small" aria-label="Se déconnecter">
										<LogOut className="size-4" aria-hidden="true" />
									</Button>
								</Form>
							</>
						) : (
							<Button asChild intent="secondary" size="small">
								<Link route="session.create" className="gap-2">
									<CircleUserRound className="size-4" aria-hidden="true" />
									<span className="hidden sm:inline">Connexion</span>
								</Link>
							</Button>
						)}
					</div>
				</div>
			</header>

			<div className={!isAuthPage ? 'min-h-[calc(100dvh-4rem)] pb-16 md:pb-0' : 'min-h-[calc(100dvh-4rem)]'}>
				{children}
			</div>

			{!isAuthPage ? <MobileNavigation url={url} /> : null}
			<Toaster position="top-center" richColors />
		</div>
	);
}
