import type { TFeatureKeys, TSelectFeatures } from './features';

export type TState<GValue, GSelectedFeatureKeys extends TFeatureKeys<GValue>[]> = {
	_features: string[];
	_value: GValue;
	_listeners: TListener<GValue, GSelectedFeatureKeys>[];
	/**
	 * Retrieves the current state value.
	 *
	 * @example
	 * ```js
	 * const currentState = $state.get();
	 * ```
	 *
	 * @returns The current state value of type `GValue`.
	 */
	get: () => Readonly<GValue>;
	/**
	 * Updates the state value.
	 *
	 * @example
	 * ```js
	 * $state.set("Hello World");
	 * ```
	 *
	 * @param newValue - The new value to set for the state, of type `GValue`.
	 */
	set: (newValue: GValue) => void;
	/**
	 * Subscribes to state changes without immediately invoking the callback.
	 * Use this to listen for changes that occur after the subscription.
	 *
	 * @param callback - The callback function to execute when the state changes.
	 * @param level - Optional parameter to specify the listener's priority level.
	 * @returns A function that, when called, will unsubscribe the listener.
	 */
	listen: (callback: TListenerCallback<GValue, GSelectedFeatureKeys>, level?: number) => () => void;
	/**
	 * Subscribes to state changes and invokes the callback immediately with the current state value.
	 *
	 * @example
	 * ```js
	 * import { $state } from '../store';
	 *
	 * const unsubscribe = $state.subscribe(value => {
	 *   console.log(value);
	 * });
	 * ```
	 *
	 * @param callback - The callback function to execute when the state changes.
	 * @param level - Optional parameter to specify the listener's priority level.
	 * @returns A function that, when called, will unsubscribe the listener.
	 */
	subscribe: (
		callback: TListenerCallback<GValue, GSelectedFeatureKeys>,
		level?: number
	) => () => void;
	/**
	 * Triggers all registered listeners to run with the current state value.
	 */
	_notify: (process: boolean) => void;
} & TSelectFeatures<GValue, GSelectedFeatureKeys>;

export type TListenerCallback<GValue, GSelectedFeatureKeys extends TFeatureKeys<GValue>[]> = (
	value: Readonly<GValue>,
	state: TState<GValue, GSelectedFeatureKeys>
) => Promise<void> | void;
export interface TListener<GValue, GSelectedFeatureKeys extends TFeatureKeys<GValue>[]> {
	callback: TListenerCallback<GValue, GSelectedFeatureKeys>;
	level: number;
}

export type TListenerQueueItem<GValue = any> = { value: Readonly<GValue> } & TListener<
	GValue,
	['base']
>;
