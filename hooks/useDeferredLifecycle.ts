import { useDeferredStore } from '@/store/deferredStore';
import { useEffect } from 'react';

export function useDeferredLifecycle() {
    const checkReadyItems = useDeferredStore((state) => state.checkReadyItems);

    useEffect(() => {
        // Check immediately on mount
        checkReadyItems();

        // Check every minute
        const interval = setInterval(() => {
            checkReadyItems();
        }, 60000);

        return () => clearInterval(interval);
    }, [checkReadyItems]);
}
