import type { TEnforceFeatures, TFeatureKeys, TFetchClient, TSelectFeatures } from '../../types';

export function withOpenApi<
	GPaths extends object,
	GSelectedFeatureKeys extends TFeatureKeys[] = ['base']
>(
	fetchClient: TFetchClient<TEnforceFeatures<GSelectedFeatureKeys, ['base']>, GPaths>
): TFetchClient<['openapi', ...GSelectedFeatureKeys], GPaths> {
	const openApiFeature: TSelectFeatures<['openapi'], GPaths> = {
		get(this: TFetchClient<['base'], GPaths>, path, options) {
			return this._baseFetch(path as string, 'GET', options as any);
		},
		post(this: TFetchClient<['base'], GPaths>, path, body, options) {
			return this._baseFetch(path as string, 'POST', {
				...(options as any),
				body
			});
		},
		put(this: TFetchClient<['base'], GPaths>, path, body, options) {
			return this._baseFetch(path as string, 'PUT', {
				...(options as any),
				body
			});
		},
		del(this: TFetchClient<['base'], GPaths>, path, options) {
			return this._baseFetch(path as string, 'DELETE', options as any);
		}
	};

	// Merge existing features from the fetch client with the new openapi feature
	const _fetchClient = Object.assign(fetchClient, openApiFeature) as TFetchClient<
		['openapi', ...GSelectedFeatureKeys],
		GPaths
	>;
	_fetchClient._features.push('openapi');

	return _fetchClient;
}
