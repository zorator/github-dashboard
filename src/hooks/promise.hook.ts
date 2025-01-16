import {DependencyList, useEffect, useState} from "react";

type UsePromiseReturn<T> = {
    result?: undefined
    status: 'error' | 'loading'
} | {
    result: T
    status: 'success'
}

export function usePromise<T>(promiseSupplier: () => Promise<T>, deps: DependencyList = []): UsePromiseReturn<T> {
    const [promiseState, setPromiseState] = useState<UsePromiseReturn<T>>({status: 'loading'});

    useEffect(() => {
        setPromiseState({status: 'loading'});
        promiseSupplier()
            .then(result => {
                setPromiseState({status: 'success', result});
            })
            .catch(() => {
                setPromiseState({status: 'error'});
            })
    }, deps);

    return promiseState
}