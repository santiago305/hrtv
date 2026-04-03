import { Modal } from '@/components/modales/Modal';
import type { ContactMessageItem } from '../types';

type Props = {
    open: boolean;
    message: ContactMessageItem | null;
    onClose: () => void;
};

export function ContactMessageDetailModal({ open, message, onClose }: Props) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={message ? `Mensaje de ${message.name}` : 'Detalle del mensaje'}
            description={message?.subject ?? ''}
            className="w-full max-w-2xl"
        >
            {message ? (
                <div className="space-y-4 text-sm">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Nombre</p>
                            <p className="mt-1 text-foreground">{message.name}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Correo</p>
                            <p className="mt-1 text-foreground">{message.email}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Fecha</p>
                        <p className="mt-1 text-foreground">{message.created_at ?? '-'}</p>
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Asunto</p>
                        <p className="mt-1 text-foreground">{message.subject}</p>
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Mensaje</p>
                        <div className="mt-1 whitespace-pre-wrap rounded-sm border border-border bg-muted/20 p-4 text-foreground">
                            {message.message}
                        </div>
                    </div>
                </div>
            ) : null}
        </Modal>
    );
}
