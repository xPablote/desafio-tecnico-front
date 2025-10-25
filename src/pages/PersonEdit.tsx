import { useEffect, useState , Component} from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Box } from '@mui/material';
import { Person } from '../types/Person';
import { getPerson } from '../services/PersonService';
import { useNotification } from '../contexts/UseNotificationContext';
import { usePersonContext } from '../contexts/UsePersonContext';
import { PersonForm } from '../components/PersonForm';

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
    state = { hasError: false };

    static getDerivedStateFromError(error: Error) {
        console.error('Error boundary caught:', error);
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <Typography color="error">Ocurrió un error al renderizar el formulario. Por favor, intenta de nuevo.</Typography>;
        }
        return this.props.children;
    }
}

const EditPerson: React.FC = () => {
    const { showNotification } = useNotification();
    const { rut } = useParams<{ rut: string }>();
    const { persons: contextPersons } = usePersonContext();
    const [person, setPerson] = useState<Person | null>(null);

    useEffect(() => {
        const fetchPerson = async () => {
            if (!rut) {
                showNotification('RUT no proporcionado', 'error');
                setPerson({
                    rut: '',
                    nombre: '',
                    apellido: '',
                    fechaNacimiento: '',
                    direccion: { calle: '', comuna: '', region: '' },
                });
                return;
            }
            try {
                const response = await getPerson(rut);
                if (response.status >= 200 && response.status < 300 && response.data && typeof response.data === 'object' && 'rut' in response.data) {
                    setPerson(response.data as Person);
                } else if (response.status === 202 && response.data && typeof response.data === 'object' && 'rut' in response.data) {
                    setPerson(response.data as Person);
                    showNotification('Datos cargados temporalmente desde el backend', 'info');
                } else {
                    const localPerson = contextPersons.find((p) => p.rut === rut);
                    if (localPerson) {
                        setPerson(localPerson);
                        showNotification('Usando datos locales debido a conexión offline', 'warning');
                    } else {
                        showNotification('Persona no encontrada, usando datos vacíos', 'warning');
                        setPerson({
                            rut,
                            nombre: '',
                            apellido: '',
                            fechaNacimiento: '',
                            direccion: { calle: '', comuna: '', region: '' },
                        });
                    }
                }
            } catch (error: unknown) {
                console.error('Error al cargar la persona:', error);
                const localPerson = contextPersons.find((p) => p.rut === rut);
                if (localPerson) {
                    setPerson(localPerson);
                    showNotification('Usando datos locales debido a conexión offline', 'warning');
                } else {
                    showNotification('Error al cargar la persona, usando datos vacíos', 'warning');
                    setPerson({
                        rut,
                        nombre: '',
                        apellido: '',
                        fechaNacimiento: '',
                        direccion: { calle: '', comuna: '', region: '' },
                    });
                }
            }
        };
        fetchPerson();
    }, [rut, showNotification, contextPersons]);

    return (
        <ErrorBoundary>
            {person ? (
                <PersonForm initialData={person} isEdit rut={rut} />
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Cargando...</Typography>
                </Box>
            )}
        </ErrorBoundary>
    );
};

export default EditPerson;