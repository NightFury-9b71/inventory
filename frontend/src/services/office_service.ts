import api from "@/lib/api";
import { Office } from "@/types/office";


export const ENDPOINTS = {
    get_offices: "/offices",
    get_all_offices: "/offices/all",
    parent_offices: "/offices/parent",
    faculty_offices: "/offices/faculties",
    department_offices: "/offices/departments",
    office_by_id: (id: number) => `/offices/${id}`,
    create_office: "/offices",
    update_office: (id: number) => `/offices/${id}`,
    delete_office: (id: number) => `/offices/${id}`,
}

export const getOffices = async (): Promise<Office[]> => {
  const response = await api.get(ENDPOINTS.get_offices);
  return response.data;
};

export const getAllOffices = async (): Promise<Office[]> => {
  const response = await api.get(ENDPOINTS.get_all_offices);
  return response.data;
};

export const getParentOffices = async () => {
  const response = await api.get(ENDPOINTS.parent_offices);
  return response.data;
};

export const getFacultyOffices = async () => {
  const response = await api.get(ENDPOINTS.faculty_offices);
  return response.data;
};

export const getDepartmentOffices = async () => {
  const response = await api.get(ENDPOINTS.department_offices);
  return response.data;
};

export const getOfficeById = async (id: number) => {
  const response = await api.get(ENDPOINTS.office_by_id(id));
  return response.data;
};

export const createOffice = async (office: any) => {
  const response = await api.post(ENDPOINTS.create_office, office);
  return response.data;
};

export const updateOffice = async (id: number, office: any) => {
  const response = await api.put(ENDPOINTS.update_office(id), office);
  return response.data;
};

export const deleteOffice = async (id: number) => {
  const response = await api.delete(ENDPOINTS.delete_office(id));
  return response.data;
}