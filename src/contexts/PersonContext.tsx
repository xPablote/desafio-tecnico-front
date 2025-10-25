import * as React from 'react';
import { Person } from '../types/Person';

export interface PersonContextType {
    persons: Person[];
    setPersons: React.Dispatch<React.SetStateAction<Person[]>>;
    syncPending: string[];
    setSyncPending: React.Dispatch<React.SetStateAction<string[]>>;
}

export const PersonContext = React.createContext<PersonContextType | undefined>(undefined);