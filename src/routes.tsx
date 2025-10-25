import { useEffect, useState } from 'react';
import { useParams, useNavigate, Routes, Route } from 'react-router-dom';
import { Typography, CircularProgress, Box } from '@mui/material';
import { Person } from './types/Person';
import { getPerson } from './services/PersonService';
import { useNotification } from './contexts/UseNotificationContext';
import { PersonForm } from './components/PersonForm';
import { PersonList } from './pages/PersonList';
import { PersonListByRut } from './pages/PersonDetails';

const EditPerson: React.FC = () => {
    const { showNotification } = useNotification();
    const { rut } = useParams<{ rut: string }>();
    const navigate = useNavigate();
    const [person, setPerson] = useState<Person | null>(null);

    useEffect(() => {
        const fetchPerson = async () => {
            if (!rut) {
                showNotification('RUT no proporcionado', 'error');
                navigate('/');
                return;
            }
            try {
                const response = await getPerson(rut);
                if (response.status >= 200 && response.status < 300 && response.data) {
                    setPerson(response.data);
                } else {
                    throw new Error(response.message || 'Persona no encontrada');
                }
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Error al cargar la persona';
                showNotification(errorMessage, 'error');
                navigate('/');
            }
        };
        fetchPerson();
    }, [rut, showNotification, navigate]);

    if (!person) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Cargando...</Typography>
            </Box>
        );
    }

    return <PersonForm initialData={person} isEdit rut={rut} />;
};

export const AppRoutes: React.FC = () => (
    <Routes>
        <Route path="/" element={<PersonList />} />
        <Route path="/create" element={<PersonForm />} />
        <Route path="/edit/:rut" element={<EditPerson />} />
        <Route path="/details/:rut" element={<PersonListByRut />} />
        <Route path="/list/:rut" element={<PersonListByRut />} />
    </Routes>
);