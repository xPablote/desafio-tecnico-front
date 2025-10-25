import { useState } from 'react';
import { Person } from '../types/Person';
import { PersonContext } from './PersonContext';

export const PersonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [syncPending, setSyncPending] = useState<string[]>([]);

    return (
        <PersonContext.Provider value={{ persons, setPersons, syncPending, setSyncPending }}>
            {children}
        </PersonContext.Provider>
    );
};