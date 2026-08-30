export interface LineBadgeProps {
	name: string;
	color: string;
	textColor?: string;
	size?: 'small' | 'medium';
}

export function LineBadge({ name, color, textColor = '#ffffff', size = 'medium' }: LineBadgeProps) {
	return (
		<span
			className={`inline-flex shrink-0 items-center justify-center rounded-lg font-black tabular-nums shadow-sm ${
				size === 'small' ? 'min-w-7 px-1.5 py-1 text-xs' : 'min-w-9 px-2 py-1.5 text-sm'
			}`}
			style={{ backgroundColor: color, color: textColor }}
			aria-label={`Ligne ${name}`}
		>
			{name}
		</span>
	);
}
