import { useContext } from 'react';
import { PersonContext, PersonContextType } from './PersonContext';

export const usePersonContext = (): PersonContextType => {
    const context = useContext(PersonContext);
    if (!context) {
        throw new Error('usePersonContext debe usarse dentro de PersonProvider');
    }
    return context;
};