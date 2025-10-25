import axios, { AxiosResponse } from 'axios';
import { Person } from '../types/Person';

const API_URL = 'http://localhost:8080/personas';

export interface ApiResponse<T> {
    data?: T;
    status: number;
    message?: string;
}

export interface ErrorResponse {
    message?: string;
    error?: string;
    statusCode?: number;
}

export async function createPerson(person: Person): Promise<ApiResponse<Person>> {
    try {
        const response: AxiosResponse<Person> = await axios.post(API_URL, person);
        return { data: response.data, status: response.status };
    } catch (error) {
        return handleApiError(error);
    }
}

export async function updatePerson(rut: string, person: Person): Promise<ApiResponse<Person>> {
    try {
        const response: AxiosResponse<Person> = await axios.put(`${API_URL}/${rut}`, person);
        return { data: response.data, status: response.status };
    } catch (error) {
        return handleApiError(error);
    }
}

export async function deletePerson(rut: string): Promise<ApiResponse<void>> {
    try {
        const response: AxiosResponse<void> = await axios.delete(`${API_URL}/${rut}`);
        return { status: response.status };
    } catch (error) {
        return handleApiError(error);
    }
}
export async function getPerson(rut: string): Promise<ApiResponse<Person>> {
    try {
        const response: AxiosResponse<Person> = await axios.get(`${API_URL}/${rut}`);
        return { data: response.data, status: response.status };
    } catch (error) {
        return handleApiError(error);
    }
}
export async function getAllPersons(): Promise<ApiResponse<Person[]>> {
    try {
        const response: AxiosResponse<Person[]> = await axios.get(API_URL);
        return { data: response.data, status: response.status };
    } catch (error) {
        return handleApiError(error);
    }
}

function handleApiError(error: unknown): {
    status: number;
    message: string;
    error?: string;
    statusCode?: number
} {
    if (axios.isAxiosError<ErrorResponse>(error) && error.response) {
        const responseData = error.response.data;
        const message = responseData?.message || 'Ocurrió un error';
        const status = error.response.status;

        return {
            status,
            message,
            ...(responseData?.error && {error: responseData.error}),
            ...(responseData?.statusCode && {statusCode: responseData.statusCode})
        };
    }
    return {
        status: 0,
        message: 'Error de red o solicitud interrumpida.'
    };
}