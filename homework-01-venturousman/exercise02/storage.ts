import { State } from "./types";

export class MyStorage<T> {
    #state: State<T> = Object.freeze({ data: [] });

    getItem(key: string): T | null {
        // your code here
        const item = this.#state.data.find((item) => item[key] !== undefined);
        // const item = this.#state.data.find((item) => item.hasOwnProperty(key));
        return item?.[key] || null;
    }
    addItem(key: string, value: T): boolean {
        // your code here
        if (this.getItem(key) === null) {
            // this.#state.data.push({ [key]: value });
            const clonedState = structuredClone(this.#state);
            const clonedData = clonedState.data;
            clonedData.push({ [key]: value });
            this.#state = Object.freeze(clonedState);
            return true;
        }
        return false;
    }
    updateItem(key: string, value: T): boolean {
        // your code here
        if (this.getItem(key) !== null) {
            const clonedState = structuredClone(this.#state);
            const clonedData = clonedState.data;
            const item = clonedData.find((item) => item[key] !== undefined);
            // @ts-ignore
            item[key] = value; // ignore TS error because we know that item[key] exists
            this.#state = Object.freeze(clonedState);
            return true;
        }
        return false;
    }
    removeItem(key: string): boolean {
        // your code here
        if (this.getItem(key) !== null) {
            const clonedState = structuredClone(this.#state);
            const clonedData = clonedState.data;
            const itemIndex = clonedData.findIndex((item) => item[key] !== undefined);
            clonedData.splice(itemIndex, 1);
            this.#state = Object.freeze(clonedState);
            return true;
        }
        return false;
    }
    getData() {
        // your code here
        return this.#state.data;
    }
}

