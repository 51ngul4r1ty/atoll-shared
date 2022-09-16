// The javascript version of this was obtained here: https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404

export type AsyncForEachCallback<T> = (item: T, index: number, items: T[]) => Promise<void>;

export async function asyncForEach<T>(array: T[], callback: AsyncForEachCallback<T>) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
