import { useState, useEffect, useCallback } from 'react';
import { getWeeklySummary } from '../api/meals';
export const useWeeklySummary = (weekStart = null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getWeeklySummary(weekStart);
            setData(result);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [weekStart]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    return { data, loading, error, refetch: fetchData };
};
