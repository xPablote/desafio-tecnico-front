import { useEffect } from 'react';
import { getAllPersons } from './services/PersonService';
import { useNotification } from './contexts/UseNotificationContext';
import { usePersonContext } from './contexts/UsePersonContext';
import { AppRoutes } from './routes';
import { Box, IconButton, Typography } from '@mui/material';
import { Home } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const App: React.FC = () => {
    const { showNotification } = useNotification();
    const { setPersons, setSyncPending } = usePersonContext();

    useEffect(() => {
        const fetchPersons = async () => {
            try {
                const response = await getAllPersons();
                const personsData = Array.isArray(response.data) ? response.data : [];
                if (response.status === 202 && personsData.length > 0) {
                    showNotification(response.message || 'Datos cargados temporalmente, se sincronizarán pronto.', 'info');
                    setPersons(personsData);
                    setSyncPending((prev) => [...new Set([...prev, ...personsData.map((p) => p.rut)])]);
                } else if (response.status >= 200 && response.status < 300 && personsData.length > 0) {
                    setPersons(personsData);
                    setSyncPending( []);
                } else {
                    throw new Error(response.message || 'Error al cargar las personas');
                }
            } catch (error: unknown) {
                setPersons([]); // Inicializar como vacío en caso de error
                const errorMessage = error instanceof Error ? error.message : 'Error al cargar las personas';
                showNotification(`Modo offline: ${errorMessage}`, 'warning');
            }
        };
        fetchPersons();
    }, [showNotification, setPersons, setSyncPending]);

    return (
        <>
            <Box
                sx={{
                    maxWidth: '1000px',
                    mx: 'auto',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    p: 2,
                    borderRadius: 1,
                    boxShadow: 1,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton component={Link} to="/" sx={{ mr: 1, color: 'inherit' }}>
                            <Home />
                        </IconButton>
                        <Typography variant="h5">CRUD de Personas</Typography>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ maxWidth: '1000px', mx: 'auto', mt: 2, p: 2 }}>
                <AppRoutes />
            </Box>
        </>
    );
};

export default App;