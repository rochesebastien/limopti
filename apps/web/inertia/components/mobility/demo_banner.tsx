import { FlaskConical } from 'lucide-react';

export function DemoBanner({ compact = false }: { compact?: boolean }) {
	return (
		<output
			className={`border-warning/20 bg-warning-soft text-warning flex items-start gap-2.5 border font-semibold ${
				compact ? 'rounded-xl px-3 py-2 text-xs' : 'rounded-2xl px-4 py-3 text-sm'
			}`}
		>
			<FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
			<span>
				Version de démonstration · horaires théoriques
				{compact ? null : (
					<span className="text-muted mt-0.5 block font-normal">
						Aucune position de bus ou perturbation temps réel n’est encore publiée dans Limopti.
					</span>
				)}
			</span>
		</output>
	);
}
