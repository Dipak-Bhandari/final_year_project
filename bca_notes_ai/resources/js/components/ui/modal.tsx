import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showCloseButton?: boolean;
    className?: string;
};

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl',
};

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
    className,
}: ModalProps) {
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent
                className={cn(
                    'max-h-[90vh] overflow-hidden',
                    sizeClasses[size],
                    className,
                )}
            >
                <DialogHeader className="flex flex-row items-start justify-between space-y-0">
                    <DialogTitle className="text-xl font-semibold">
                        {title}
                    </DialogTitle>
                    {showCloseButton && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </DialogHeader>
                <div className="max-h-[65vh] overflow-y-auto pr-1">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}