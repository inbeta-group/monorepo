export class FetchError extends Error {
	public readonly code: TErrorCode;
	public readonly throwable?: Error;

	constructor(code: TErrorCode, options: TFetchErrorOptions = {}) {
		const { description = options.throwable?.message, throwable } = options;
		super(description != null ? `[${code}] ${description}` : code);
		this.code = code;
		this.throwable = throwable;

		// https://stackoverflow.com/questions/59625425/understanding-error-capturestacktrace-and-stack-trace-persistance
		Error.captureStackTrace(this);
	}
}

interface TFetchErrorOptions {
	description?: string;
	throwable?: Error;
}

export type TErrorCode = `#ERR_${string}`;
