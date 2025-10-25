import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Box,
    TextField,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { deletePerson } from '../services/PersonService';
import { calculateAge } from '../utils/CalculateAge';
import { useNotification } from '../contexts/UseNotificationContext';
import { Link } from 'react-router-dom';
import { usePersonContext } from '../contexts/UsePersonContext';

export const PersonList: React.FC = () => {
    const { showNotification } = useNotification();
    const { persons: contextPersons, setPersons: setContextPersons, setSyncPending } = usePersonContext();

    const handleDelete = async (rut: string) => {
        if (window.confirm('¿Estás seguro de eliminar esta persona?')) {
            try {
                const response = await deletePerson(rut);
                if (response.status === 202) {
                    setContextPersons((prev) => prev.filter((p) => p.rut !== rut));
                    setSyncPending((prev) => [...new Set([...prev, rut])]);
                    showNotification('Eliminación guardada temporalmente', 'info');
                } else if (response.status >= 200 && response.status < 300) {
                    setContextPersons((prev) => prev.filter((p) => p.rut !== rut));
                    setSyncPending((prev) => prev.filter((r) => r !== rut));
                    showNotification('Persona eliminada exitosamente', 'success');
                } else {
                    throw new Error(response.message || 'Error al eliminar la persona');
                }
            } catch (error: unknown) {
                console.error('Error al eliminar la persona:', error);
                setContextPersons((prev) => prev.filter((p) => p.rut !== rut));
                setSyncPending((prev) => [...new Set([...prev, rut])]);
                showNotification('Eliminación guardada localmente, se sincronizará cuando la conexión esté disponible', 'warning');
            }
        }
    };

    return (
        <Box sx={{ maxWidth: '1000px', mx: 'auto', mt: 4, p: 2 }}>
            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Buscar por RUT"
                    value=""
                    onChange={() => {}}
                    sx={{ width: 200, mb: 1 }}
                    inputProps={{ maxLength: 10 }}
                />
            </Box>

            <TableContainer component={Paper} sx={{ width: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>RUT</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Apellido</TableCell>
                            <TableCell>Edad</TableCell>
                            <TableCell>Dirección</TableCell>
                            <TableCell>
                                <Button
                                    color="inherit"
                                    variant="contained"
                                    component={Link}
                                    to="/create"
                                    sx={{ bgcolor: 'secondary.main', minWidth: '100px' }}
                                >
                                    Crear
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contextPersons.map((person) => (
                            <TableRow key={person.rut}>
                                <TableCell>{person.rut}</TableCell>
                                <TableCell>{person.nombre}</TableCell>
                                <TableCell>{person.apellido}</TableCell>
                                <TableCell>{calculateAge(person.fechaNacimiento) ?? 'No válida'}</TableCell>
                                <TableCell>{`${person.direccion.calle}, ${person.direccion.comuna}, ${person.direccion.region}`}</TableCell>
                                <TableCell>
                                    <IconButton component={Link} to={`/edit/${person.rut}`}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(person.rut)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default PersonList;