import { type TState } from 'feature-state';
import { type BitwiseFlag } from '@ibg/utils';

import { type TCollectErrorMode } from './form';

export type TFormField<GValue> = TState<GValue | undefined, ['base', 'form-field']>;

export interface TFormFieldStateFeature<GValue> {
	_config: TFormFieldStateConfig;
	_intialValue: GValue | undefined;
	key: string;
	isTouched: boolean;
	isSubmitted: boolean;
	isSubmitting: boolean;
	validator: TFormFieldValidator<GValue>;
	status: TFormFieldStatus;
	validate: () => Promise<boolean>;
	isValid: () => boolean;
	blur: () => void;
	reset: () => void;
}

export interface TFormFieldStateConfig {
	editable: boolean;
	/**
	 * Validation strategy before submitting.
	 */
	// TODO: Is BitwiseFlag to confusing for enduser?
	validateMode: BitwiseFlag<FormFieldValidateMode>;
	/**
	 * Validation strategy after submitting.
	 */
	// TODO: Is BitwiseFlag to confusing for enduser?
	reValidateMode: BitwiseFlag<FormFieldReValidateMode>;
	collectErrorMode: TCollectErrorMode;
}

export enum FormFieldValidateMode {
	// eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member, no-bitwise -- ok here
	OnBlur = 1 << 0, // 1
	// eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member, no-bitwise -- ok here
	OnChange = 1 << 1, // 2
	// eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member, no-bitwise -- ok here
	OnSubmit = 1 << 2, // 4
	// eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member, no-bitwise -- ok here
	OnTouched = 1 << 3 // 8
}

export enum FormFieldReValidateMode {
	// eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member, no-bitwise -- ok here
	OnBlur = 1 << 0, // 1
	// eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member, no-bitwise -- ok here
	OnChange = 1 << 1, // 2
	// eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member, no-bitwise -- ok here
	OnSubmit = 1 << 2 // 4
}

export type TFormFieldStatus = TState<TFormFieldStatusValue, ['base', 'form-field-status']>;

export interface TFormFielStatusStateFeature {
	_nextValue?: TFormFieldStatusValue;
	registerNextError: (error: TInvalidFormFieldError) => void;
}

export type TFormFieldStatusValue =
	| TInvalidFormFieldStatus
	| TValidFormFieldStatus
	| TUnvalidatedFormFieldStatus;

export interface TInvalidFormFieldStatus {
	type: 'INVALID';
	errors: TInvalidFormFieldError[];
}

export interface TValidFormFieldStatus {
	type: 'VALID';
}

export interface TUnvalidatedFormFieldStatus {
	type: 'UNVALIDATED';
}

export interface TInvalidFormFieldError {
	code: string;
	message?: string;
	path?: string;
}

export type TValidateFormFieldFunction<GValue> = (
	formField: TFormField<GValue>
) => Promise<void> | void;
export interface TFormFieldValidationLink<GValue> {
	key: string;
	validate: TValidateFormFieldFunction<GValue>;
}
export type TFormFieldValidationChain<GValue> = TFormFieldValidationLink<GValue>[];

export interface TFormFieldValidator<GValue> {
	_validationChain: TFormFieldValidationChain<GValue>;
	isValidating: boolean;
	validate: (formField: TFormField<GValue>) => Promise<boolean>;
	append: (validator: TFormFieldValidator<GValue>) => TFormFieldValidator<GValue>;
	clone: () => TFormFieldValidator<GValue>;
	push: (...validateFunctions: TFormFieldValidationLink<GValue>[]) => void;
}
