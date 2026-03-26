import { type User } from '@/types';

export function hasRequiredRole(user: User | null | undefined, roles?: string[]): boolean {
    if (!roles || roles.length === 0) {
        return true;
    }

    const userRole = user?.role?.slug;

    if (!userRole) {
        return false;
    }

    return roles.includes(userRole);
}
