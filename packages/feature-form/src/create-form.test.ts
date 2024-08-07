import { createValidator } from 'validation-adapter';
import { describe, expect, it } from 'vitest';

import { createForm } from './create-form';
import { fromValidator } from './helper';

describe('createForm function', () => {
	it('shoudl work', async () => {
		const form = createForm({
			fields: {
				item5: fromValidator<number>(
					createValidator([
						{
							key: 'date',
							validate: (cx) => {
								if (typeof cx.value === 'number') {
									const date = new Date(cx.value);
								}
							}
						}
					]),
					{
						defaultValue: Date.now()
					}
				)
			}
		});

		const test = form.getField('item5');

		const isValid = await form.validate();
		await form.submit();

		expect(form).not.toBeNull();
	});
});
