import { Field as ArkField } from '@ark-ui/react/field';
import { type ReactNode } from 'react';
import { tv } from 'tailwind-variants';
import { Input, type InputProps } from '../../atoms/input/input';

const fieldRoot = tv({ base: 'space-y-1.5' });
const fieldLabel = tv({ base: 'text-ink-soft block text-[0.8125rem] font-medium' });
const fieldError = tv({ base: 'text-critical block text-[0.8125rem]' });

export interface FieldProps extends InputProps {
	label: ReactNode;
	error?: ReactNode;
	invalid?: boolean;
	rootClassName?: string;
}

export function Field({ label, error, invalid = Boolean(error), rootClassName, disabled, ...inputProps }: FieldProps) {
	return (
		<ArkField.Root className={fieldRoot({ className: rootClassName })} invalid={invalid} disabled={disabled}>
			<ArkField.Label className={fieldLabel()}>{label}</ArkField.Label>
			<ArkField.Input asChild>
				<Input disabled={disabled} {...inputProps} />
			</ArkField.Input>
			{error ? <ArkField.ErrorText className={fieldError()}>{error}</ArkField.ErrorText> : null}
		</ArkField.Root>
	);
}
