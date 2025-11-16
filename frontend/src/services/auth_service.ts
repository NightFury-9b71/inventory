import api from "@/lib/api";
import { KEY } from "@/lib/api";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";


export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  FACULTY_ADMIN = 'FACULTY_ADMIN',
  DEPARTMENT_ADMIN = 'DEPARTMENT_ADMIN',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  FACULTY_MEMBER = 'FACULTY_MEMBER',
  OFFICE_MANAGER = 'OFFICE_MANAGER',
  PROCUREMENT_MANAGER = 'PROCUREMENT_MANAGER',
  STAFF = 'STAFF',
  STUDENT = 'STUDENT',
  VIEWER = 'VIEWER',
  USER = 'USER',
  GUEST = 'GUEST',
}

export interface User {
  id: string;
  username: string;
  email?: string;
  name?: string;
  role: string;
  permissions: string[];
  officeId?: string;
  officeName?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}


export const ENDPOINTS = {
    login: "/auth/login",
}


export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const { data } = await api.post<LoginResponse>(ENDPOINTS.login, {
      username: credentials.username,
      password: credentials.password,
    });

    // Store token and user info
    // Use explicit cookie options so Next.js middleware can see the cookie when
    // pages are requested. In production we use secure cookies.
    const cookieOptions = {
      path: '/',
      sameSite: 'lax' as 'lax' | 'strict' | 'none',
      secure: process.env.NODE_ENV === 'production',
    };

    // If user selected rememberMe, keep the cookie for 7 days; otherwise session cookie
    const expires = credentials.rememberMe ? 7 : undefined;

    Cookies.set(KEY.auth_token, data.token, { ...cookieOptions, expires });
  // Encode user JSON to ensure safe cookie characters for cross-server reading
  Cookies.set(KEY.user_info, encodeURIComponent(JSON.stringify(data.user)), { ...cookieOptions, expires });
    if (process.env.NODE_ENV === 'development') {
      console.debug('[auth_service] set cookies', {
        auth_token: Cookies.get(KEY.auth_token),
        user_info: Cookies.get(KEY.user_info),
      });
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Login failed. Server Issue!');
  }
};

export const logout = () => {
    Cookies.remove(KEY.auth_token);
    Cookies.remove(KEY.user_info);
    
    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = "/login";
    }
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: login,
  });
};