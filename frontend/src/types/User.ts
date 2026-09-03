export type Role = 'User' | 'Admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: Role;
  address?: string;
  createdAt: string;
  isActive: boolean;
}
