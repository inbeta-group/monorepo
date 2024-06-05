import type { Result } from 'ts-results-es';

import type { NetworkException, RequestException, ServiceException } from '../exceptions';
import type { FetchHeaders } from '../helper';
import type { TParseAs, TRequestMethod } from './api';
import type { TFeatureKeys, TSelectFeatures } from './features';

export type TFetchClient<
	GSelectedFeatureKeys extends TFeatureKeys[],
	GPaths extends object = object
> = {
	_features: string[];
	_config: TFetchClientConfig;
	_baseFetch: <
		GSuccessResponseBody = unknown,
		GErrorResponseBody = unknown,
		GParseAs extends TParseAs = 'json'
	>(
		path: string,
		method: TRequestMethod,
		options: TFetchOptionsWithBody<GParseAs>
	) => Promise<TFetchResponse<GSuccessResponseBody, GErrorResponseBody, GParseAs>>;
} & TSelectFeatures<GSelectedFeatureKeys, GPaths>;

// =============================================================================
// Fetch Client Options & Config
// =============================================================================

export interface TBaseFetchClientConfig {
	prefixUrl: string;
	pathSerializer: TPathSerializer;
	querySerializer: TQuerySerializer;
	bodySerializer: TBodySerializer;
	fetchProps: Omit<RequestInit, 'body' | 'method' | 'headers'>;
	fetch?: TBaseFetch;
}

export type TBaseFetch = (url: URL | string, init?: RequestInit) => ReturnType<typeof fetch>;

export type TFetchClientConfig = {
	headers: FetchHeaders;
	middleware: TRequestMiddleware[];
} & TBaseFetchClientConfig;

export type TFetchClientOptions = Partial<TBaseFetchClientConfig> & {
	headers?: RequestInit['headers'] | FetchHeaders;
	middleware?: TRequestMiddleware | TRequestMiddleware[];
};

// ============================================================================
// Serializer Methods
// ============================================================================

export type TPathSerializer<GPathParams extends Record<string, unknown> = Record<string, unknown>> =
	(path: string, params: GPathParams) => string;

export type TQuerySerializer<
	GQueryParams extends Record<string, unknown> = Record<string, unknown>
> = (params: GQueryParams) => string;

export type TBodySerializer<GBody = unknown, GResult extends TSerializedBody = TSerializedBody> = (
	body: GBody,
	contentType?: string
) => GResult;

// ============================================================================
// Middleware
// ============================================================================

export type TRequestMiddleware = (
	data: {
		props: unknown;
	} & TRequestMiddlewareData
) => Promise<Partial<TRequestMiddlewareData>>;

export interface TRequestMiddlewareData {
	requestInit: RequestInit;
	queryParams: TUrlParams['query'];
	pathParams: TUrlParams['path'];
}

export interface TUrlParams {
	query?: Record<string, unknown>;
	path?: Record<string, unknown>;
}

export type TSerializedBody = RequestInit['body'];
export type TUnserializedBody = TSerializedBody | Record<string, unknown>;

// =============================================================================
// Fetch Options
// =============================================================================

export interface TBaseFetchOptions<GParseAs extends TParseAs> {
	parseAs?: GParseAs | TParseAs; // '| TParseAs' to fix VsCode autocomplete
	headers?: RequestInit['headers'];
	prefixUrl?: string;
	fetchProps?: Omit<RequestInit, 'body' | 'method' | 'headers'>;
	middlewareProps?: unknown;
}

export type TFetchOptions<GParseAs extends TParseAs> = {
	queryParams?: TUrlParams['query'];
	pathParams?: TUrlParams['path'];
	querySerializer?: TQuerySerializer;
	bodySerializer?: TBodySerializer;
} & TBaseFetchOptions<GParseAs>;

export type TFetchOptionsWithBody<GParseAs extends TParseAs> = {
	body?: TUnserializedBody; // TODO: Only if POST or PUT
} & TFetchOptions<GParseAs>;

// =============================================================================
// Fetch Response
// =============================================================================

export type TResponseBodyWithParseAs<
	GResponseBody,
	GParseAs extends TParseAs
> = GParseAs extends 'json'
	? GResponseBody
	: GParseAs extends 'text'
		? Awaited<ReturnType<Response['text']>>
		: GParseAs extends 'blob'
			? Awaited<ReturnType<Response['blob']>>
			: GParseAs extends 'arrayBuffer'
				? Awaited<ReturnType<Response['arrayBuffer']>>
				: GParseAs extends 'stream'
					? Response['body']
					: never;

export interface TFetchResponseSuccess<GSuccessResponseBody, GParseAs extends TParseAs> {
	data: TResponseBodyWithParseAs<GSuccessResponseBody, GParseAs>;
	response: Response;
}

export type TFetchResponseError<GErrorResponseBody = unknown> =
	| NetworkException
	| RequestException<GErrorResponseBody>
	| ServiceException;

export type TFetchResponse<
	GSuccessResponseBody,
	GErrorResponseBody,
	GParseAs extends TParseAs
> = Result<
	TFetchResponseSuccess<GSuccessResponseBody, GParseAs>,
	TFetchResponseError<GErrorResponseBody>
>;
