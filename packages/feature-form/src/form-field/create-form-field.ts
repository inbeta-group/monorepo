import { createState } from 'feature-state';
import { bitwiseFlag, deepCopy } from '@ibg/utils';

import {
	FormFieldReValidateMode,
	FormFieldValidateMode,
	type TFormField,
	type TFormFieldStateConfig,
	type TFormFieldStateFeature,
	type TFormFieldValidator
} from '../types';
import { createStatus } from './create-status';

export function createFormField<GValue>(
	initialValue: GValue | undefined,
	config: TCreateFormFieldConfig<GValue>
): TFormField<GValue> {
	const {
		key,
		validator,
		editable = true,
		reValidateMode = bitwiseFlag(FormFieldReValidateMode.OnBlur),
		validateMode = bitwiseFlag(FormFieldValidateMode.OnSubmit),
		collectErrorMode = 'firstError',
		notifyOnStatusChange = true
	} = config;
	const formFieldState = createState(initialValue);

	const status = createStatus({ type: 'UNVALIDATED' });

	// Notify form field listeners if status has changed
	if (notifyOnStatusChange) {
		status.listen(
			() => {
				formFieldState._notify({ additionalData: { source: 'status' } });
			},
			{ key: 'form-field' }
		);
	}

	const formFieldFeature: TFormFieldStateFeature<GValue> = {
		_config: {
			editable,
			validateMode,
			reValidateMode,
			collectErrorMode
		},
		_intialValue: deepCopy(formFieldState._value),
		key,
		isTouched: false,
		isSubmitted: false,
		isSubmitting: false,
		validator,
		status,
		async validate(this: TFormField<GValue>) {
			return this.validator.validate(this);
		},
		isValid(this: TFormField<GValue>) {
			return this.status.get().type === 'VALID';
		},
		blur(this: TFormField<GValue>) {
			if (
				(this.isSubmitted && this._config.reValidateMode.has(FormFieldReValidateMode.OnBlur)) ||
				(!this.isSubmitted &&
					(this._config.validateMode.has(FormFieldValidateMode.OnBlur) ||
						(this._config.validateMode.has(FormFieldValidateMode.OnTouched) && !this.isTouched)))
			) {
				void this.validate();
			}

			this.isTouched = true;
		},
		reset(this: TFormField<GValue>) {
			this.set(this._intialValue);
			this.isTouched = false;
			this.isSubmitted = false;
			this.isSubmitting = false;
			this.status.set({ type: 'UNVALIDATED' });
		}
	};

	// Merge existing features from the state with the new form field feature
	const _formField = Object.assign(
		formFieldState,
		formFieldFeature
	) as unknown as TFormField<GValue>;
	_formField._features.push('form-field');

	return _formField;
}

export interface TCreateFormFieldConfig<GValue> extends Partial<TFormFieldStateConfig> {
	key: string;
	validator: TFormFieldValidator<GValue>;
	notifyOnStatusChange?: boolean;
}
