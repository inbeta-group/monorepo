import { RequestError } from '../exceptions';

export function isStatusCode(error: unknown, statusCode: number): boolean {
	if (error instanceof RequestError) {
		return error.status === statusCode;
	} else if (typeof error === 'object' && error != null && 'status' in error) {
		return error.status === statusCode;
	}
	return false;
}
