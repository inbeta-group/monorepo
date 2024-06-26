import { ServiceException, type TErrorCode } from './ServiceException';

export class RequestException<GData = unknown> extends ServiceException {
	public readonly status: number;
	public readonly response?: Response;
	public readonly data?: GData;

	constructor(code: TErrorCode, status: number, options: TRequestExceptionOptions<GData> = {}) {
		const { description, response, data } = options;
		super(code, {
			message: `Call to endpoint failed by exception with status code ${status.toString()}${
				description != null ? `: ${description}` : '!'
			}`
		});
		this.status = status;
		this.response = response;
		this.data = data;
	}
}

interface TRequestExceptionOptions<GData> {
	description?: string;
	data?: GData;
	response?: Response;
}
