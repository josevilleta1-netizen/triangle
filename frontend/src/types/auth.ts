export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: 'ADMINISTRADOR' | 'CAJERO' | 'ALMACENISTA';
  roleName: string;
  permissions: string[];
  hasPinConfigured: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}
