import { ark } from '@ark-ui/react/factory';
import { type ComponentPropsWithRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const input = tv({
	base: 'border-border bg-surface text-ink placeholder:text-faint focus:border-ink data-[invalid]:border-critical data-[invalid]:focus:border-critical rounded-control block w-full border transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-40',
	variants: {
		inputSize: {
			small: 'h-8 px-2.5 text-[0.8125rem]',
			medium: 'h-9 px-3 text-sm',
			large: 'h-11 px-3.5 text-sm',
		},
	},
	defaultVariants: {
		inputSize: 'medium',
	},
});

type InputVariants = VariantProps<typeof input>;

export interface InputProps extends ComponentPropsWithRef<typeof ark.input>, InputVariants {}

export function Input({ className, inputSize, ...props }: InputProps) {
	return <ark.input className={input({ className, inputSize })} {...props} />;
}
