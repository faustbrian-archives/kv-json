// tslint:disable: no-unsafe-any
import { StoreSync as AbstractStore } from "@keeveestore/file";
import { ensureFileSync, readJSONSync, writeJSONSync } from "fs-extra";

export class StoreSync<K, T> extends AbstractStore<K, T> {
	public static new<K, T>(uri: string): StoreSync<K, T> {
		return new StoreSync<K, T>(new Map<K, T>(), uri);
	}

	protected dump(): void {
		// @ts-ignore
		const rows: Record<K, T> = {};

		for (const [key, value] of this.all()) {
			rows[key] = value;
		}

		writeJSONSync(this.uri, rows);
	}

	protected load(): void {
		ensureFileSync(this.uri);

		try {
			for (const [key, value] of Object.entries(readJSONSync(this.uri))) {
				// @ts-ignore
				this.put(key, value);
			}
		} catch (error) {} // tslint:disable-line: no-empty
	}
}
