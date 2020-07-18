import { useCallback, useEffect, useState } from 'react';

import api from '../services/api';

function useApiRequest(initialLoading, path) {
    const valueState = useState(undefined);
    const errorState = useState(undefined);
    const loadingState = useState(initialLoading);

    const [value, setValue] = valueState;
    const [error, setError] = errorState;
    const [loading, setLoading] = loadingState;

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get(path);
            setValue(data);
            setError(undefined);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    }, [path, setValue, setError, setLoading]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    return {
        data: value,
        loading,
        error,
        reload: fetchData,
        setData: setValue,
    };
}

export default useApiRequest;
