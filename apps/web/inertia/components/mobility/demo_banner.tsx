import { Link } from '@adonisjs/inertia/react';

/**
 * Single, discreet reminder that the data is theoretical. It stays one line so
 * it can sit on any page without competing with the content.
 */
export function DemoBanner({ className = '' }: { className?: string }) {
	return (
		<p className={`text-muted flex items-center gap-1.5 text-xs ${className}`}>
			<span className="bg-warning size-1.5 shrink-0 rounded-full" aria-hidden="true" />
			Horaires théoriques, pas de temps réel.
			<Link route="sources.index" className="text-ink underline underline-offset-2 hover:no-underline">
				Sources
			</Link>
		</p>
	);
}
