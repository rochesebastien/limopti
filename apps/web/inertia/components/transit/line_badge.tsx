export interface LineBadgeProps {
	name: string;
	color: string;
	textColor?: string;
	size?: 'small' | 'medium';
}

export function LineBadge({ name, color, textColor = '#ffffff', size = 'medium' }: LineBadgeProps) {
	return (
		<span
			className={`inline-flex shrink-0 items-center justify-center rounded font-medium tabular-nums ${
				size === 'small' ? 'min-w-5 px-1.5 py-0.5 text-[0.6875rem]' : 'min-w-7 px-2 py-1 text-xs'
			}`}
			style={{ backgroundColor: color, color: textColor }}
			aria-label={`Ligne ${name}`}
		>
			{name}
		</span>
	);
}
