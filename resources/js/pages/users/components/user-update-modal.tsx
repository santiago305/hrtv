import { Modal } from '@/components/modales/Modal';
import type { UserTableItem } from '../types';

type UserUpdateModalProps = {
    open: boolean;
    user: UserTableItem | null;
    onClose: () => void;
};

export function UserUpdateModal({ open, user, onClose }: UserUpdateModalProps) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={user ? `Editar usuario: ${user.name}` : 'Editar usuario'}
            className="w-full max-w-xs"
            bodyClassName="text-sm text-foreground"
        >
            <p>hola</p>
        </Modal>
    );
}
