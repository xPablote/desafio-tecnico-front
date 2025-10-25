import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Grid } from '@mui/material';
import type { Person } from '../types/Person';
import { validateRut } from '../utils/Validators';
import { useNotification } from '../contexts/UseNotificationContext';
import {usePersonContext} from '../contexts/UsePersonContext';
import { createPerson, updatePerson, ApiResponse } from '../services/PersonService';
import { useNavigate } from 'react-router-dom';

interface PersonFormProps {
    initialData?: Person;
    isEdit?: boolean;
    rut?: string;
}

export const PersonForm: React.FC<PersonFormProps> = ({ initialData, isEdit = false, rut }) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm<Person>({
        defaultValues: initialData || {
            rut: '',
            nombre: '',
            apellido: '',
            fechaNacimiento: '',
            direccion: { calle: '', comuna: '', region: '' },
        },
    });
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const { setPersons, setSyncPending } = usePersonContext();

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const validateDateFormat = (value: string) => {
        const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
        if (!regex.test(value)) return 'La fecha debe tener el formato dd-MM-yyyy';
        const [day, month, year] = value.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        if (isNaN(date.getTime()) || date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
            return 'Fecha inválida';
        }
        const today = new Date();
        if (date > today) return 'La fecha no puede ser futura';
        return true;
    };

    const onSubmit = async (data: Person) => {
        try {
            let response: ApiResponse<Person>;
            if (isEdit) {
                if (!rut) {
                    showNotification('RUT no proporcionado para la edición', 'error');
                    navigate('/');
                    return;
                }
                response = await updatePerson(rut, data);
                if (response.status === 202 && response.data) {
                    setPersons((prev) => prev.map((p) => (p.rut === rut ? response.data ?? p : p)));
                    setSyncPending((prev) => [...new Set([...prev, rut])]);
                    showNotification('Operación guardada temporalmente', 'info');
                    navigate('/');
                } else if (response.status >= 200 && response.status < 300 && response.data) {
                    setPersons((prev) => prev.map((p) => (p.rut === rut ? response.data ?? p : p)));
                    setSyncPending((prev) => prev.filter((r) => r !== rut));
                    showNotification('Persona actualizada exitosamente', 'success');
                    navigate('/');
                } else if (response.status === 400) {
                    throw new Error(response.message || 'Solicitud inválida, verifique los datos');
                } else if (response.status === 404) {
                    throw new Error(response.message || 'Persona no encontrada');
                } else if (response.status === 409) {
                    throw new Error(response.message || 'El RUT ya está registrado');
                } else {
                    throw new Error(response.message || 'Error al actualizar la persona');
                }
            } else {
                response = await createPerson(data);
                if (response.status === 202 && response.data) {
                    setPersons((prev) => response.data ? [...prev, response.data] : prev);
                    setSyncPending((prev) => [...new Set([...prev, data.rut])]);
                    showNotification('Operación guardada temporalmente', 'info');
                    navigate('/');
                } else if (response.status >= 200 && response.status < 300 && response.data) {
                    setPersons((prev) => response.data ? [...prev, response.data] : prev);
                    setSyncPending((prev) => prev.filter((r) => r !== data.rut));
                    showNotification('Persona creada exitosamente', 'success');
                    navigate('/');
                } else if (response.status === 400) {
                    throw new Error(response.message || 'Solicitud inválida, verifique los datos');
                } else if (response.status === 409) {
                    throw new Error(response.message || 'El RUT ya está registrado');
                } else {
                    throw new Error(response.message || 'Error al crear la persona');
                }
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error al procesar la solicitud';
            showNotification(errorMessage, 'error');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Controller
                        name="rut"
                        control={control}
                        rules={{
                            required: 'El RUT es obligatorio',
                            validate: (value) => validateRut(value) || 'RUT inválido',
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="RUT"
                                fullWidth
                                error={!!errors.rut}
                                helperText={errors.rut?.message}
                                disabled={isEdit}
                                inputProps={{ maxLength: 10 }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="nombre"
                        control={control}
                        rules={{ required: 'El nombre es obligatorio', maxLength: { value: 50, message: 'Máximo 50 caracteres' } }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Nombre"
                                fullWidth
                                error={!!errors.nombre}
                                helperText={errors.nombre?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="apellido"
                        control={control}
                        rules={{ required: 'El apellido es obligatorio', maxLength: { value: 50, message: 'Máximo 50 caracteres' } }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Apellido"
                                fullWidth
                                error={!!errors.apellido}
                                helperText={errors.apellido?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="fechaNacimiento"
                        control={control}
                        rules={{
                            required: 'La fecha de nacimiento es obligatoria',
                            validate: validateDateFormat,
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Fecha de Nacimiento (dd-MM-yyyy)"
                                fullWidth
                                error={!!errors.fechaNacimiento}
                                helperText={errors.fechaNacimiento?.message}
                                inputProps={{ maxLength: 10 }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="direccion.calle"
                        control={control}
                        rules={{ required: 'La calle es obligatoria', maxLength: { value: 100, message: 'Máximo 100 caracteres' } }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Calle"
                                fullWidth
                                error={!!errors.direccion?.calle}
                                helperText={errors.direccion?.calle?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="direccion.comuna"
                        control={control}
                        rules={{ required: 'La comuna es obligatoria', maxLength: { value: 50, message: 'Máximo 50 caracteres' } }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Comuna"
                                fullWidth
                                error={!!errors.direccion?.comuna}
                                helperText={errors.direccion?.comuna?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="direccion.region"
                        control={control}
                        rules={{ required: 'La región es obligatoria', maxLength: { value: 50, message: 'Máximo 50 caracteres' } }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Región"
                                fullWidth
                                error={!!errors.direccion?.region}
                                helperText={errors.direccion?.region?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" fullWidth>
                        {isEdit ? 'Actualizar' : 'Crear'} Persona
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};