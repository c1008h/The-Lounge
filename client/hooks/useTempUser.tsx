import { useState, useEffect } from 'react';

export const useTempUser = () => {
    const [tempUser, setTempUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('tempUser');
        if (userData) {
            setTempUser(JSON.parse(userData));
        }
    }, []);

    const saveTempUser = (userData) => {
        localStorage.setItem('tempUser', JSON.stringify(userData));
        setTempUser(userData);
    };

    return [tempUser, saveTempUser];
};
