import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
    Button,
    Box,
    TextField,
} from '@mui/material';
import { Delete, Edit, Home } from '@mui/icons-material';
import { Person } from '../types/Person';
import { getAllPersons, deletePerson, getPerson } from '../services/PersonService';
import { calculateAge } from '../utils/CalculateAge';
import { useNotification } from '../contexts/UseNotificationContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usePersonContext } from '../contexts/UsePersonContext';

const PersonListByRut: React.FC = () => {
    const { rut } = useParams<{ rut: string }>();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [person, setPerson] = useState<Person | null>(null);

    useEffect(() => {
        const fetchPersonByRut = async () => {
            if (!rut) {
                navigate('/');
                return;
            }
            try {
                const response = await getPerson(rut);
                if (response.status === 202) {
                    showNotification(response.message || 'Datos cargados temporalmente', 'info');
                    if (response.data) setPerson(response.data);
                } else if (response.status >= 200 && response.status < 300 && response.data) {
                    setPerson(response.data);
                } else {
                    throw new Error(response.message || 'Persona no encontrada');
                }
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Error al cargar la persona';
                showNotification(errorMessage, 'error');
            }
        };
        fetchPersonByRut();
    }, [rut, showNotification, navigate]);

    return (
        <Box sx={{ maxWidth: '1000px', mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Detalles por RUT: {rut}
            </Typography>
            {person ? (
                <Box>
                    <Typography>
                        <strong>RUT:</strong> {person.rut}
                    </Typography>
                    <Typography>
                        <strong>Nombre:</strong> {person.nombre}
                    </Typography>
                    <Typography>
                        <strong>Apellido:</strong> {person.apellido}
                    </Typography>
                    <Typography>
                        <strong>Fecha de Nacimiento:</strong> {person.fechaNacimiento}
                    </Typography>
                    <Typography>
                        <strong>Edad:</strong> {calculateAge(person.fechaNacimiento) ?? 'No válida'} años
                    </Typography>
                    <Typography>
                        <strong>Dirección:</strong> {`${person.direccion.calle}, ${person.direccion.comuna}, ${person.direccion.region}`}
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
                        Volver
                    </Button>
                </Box>
            ) : (
                <Typography align="center">Persona no encontrada o cargando...</Typography>
            )}
        </Box>
    );
};

export const PersonList: React.FC = () => {
    const [searchRut, setSearchRut] = useState<string>('');
    const { showNotification } = useNotification();
    const { persons: contextPersons, setPersons: setContextPersons } = usePersonContext();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPersons = async () => {
            try {
                const response = await getAllPersons();
                if (response.status === 202) {
                    showNotification(response.message || 'Datos cargados temporalmente, se sincronizarán pronto.', 'info');
                    if (response.data) setContextPersons(response.data);
                } else if (response.status >= 200 && response.status < 300 && response.data) {
                    setContextPersons(response.data);
                } else {
                    throw new Error(response.message || 'Error al cargar las personas');
                }
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Error al cargar las personas';
                showNotification(errorMessage, 'error');
            }
        };
        fetchPersons();
    }, [showNotification, setContextPersons]);

    const handleDelete = async (rut: string) => {
        if (window.confirm('¿Estás seguro de eliminar esta persona?')) {
            try {
                const response = await deletePerson(rut);
                if (response.status === 202) {
                    setContextPersons((prev) => prev.filter((p) => p.rut !== rut));
                    showNotification('Eliminación guardada temporalmente', 'info');
                    navigate('/');
                } else if (response.status >= 200 && response.status < 300) {
                    setContextPersons((prev) => prev.filter((p) => p.rut !== rut));
                    showNotification('Persona eliminada exitosamente', 'success');
                } else {
                    throw new Error(response.message || 'Error al eliminar la persona');
                }
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la persona';
                showNotification(errorMessage, 'error');
            }
        }
    };

    const handleSearch = () => {
        if (searchRut) {
            navigate(`/list/${searchRut}`);
        }
    };

    return (
        <Box sx={{ maxWidth: '1000px', mx: 'auto', mt: 4, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton component={Link} to="/" sx={{ mr: 1 }}>
                    <Home />
                </IconButton>
                <Typography variant="h5">Lista de Personas</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <TextField
                    label="Buscar por RUT"
                    value={searchRut}
                    onChange={(e) => setSearchRut(e.target.value)}
                    sx={{ mr: 2, width: 200 }}
                    inputProps={{ maxLength: 10 }}
                />
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={handleSearch}
                    sx={{ mr: 2 }}
                >
                    Buscar
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    component={Link}
                    to="/create"
                >
                    Crear
                </Button>
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
                            <TableCell>Acciones</TableCell>
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

export { PersonListByRut };