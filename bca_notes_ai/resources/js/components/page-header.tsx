import { cn } from '@/lib/utils';

type PageHeaderProps = {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    eyebrow?: string;
    className?: string;
    align?: 'start' | 'center';
};

export function PageHeader({
    title,
    description,
    actions,
    eyebrow,
    className,
    align = 'start',
}: PageHeaderProps) {
    return (
        <div
            className={cn(
                'flex flex-col gap-4 pb-6',
                align === 'center' ? 'text-center sm:items-center' : 'text-left',
                className,
            )}
        >
            <div
                className={cn(
                    'flex flex-col gap-2',
                    align === 'start'
                        ? 'sm:flex-row sm:items-center sm:justify-between'
                        : 'items-center',
                )}
            >
                <div className={cn('space-y-1', align === 'center' && 'max-w-2xl')}>
                    {eyebrow && (
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {eyebrow}
                        </p>
                    )}
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-base text-muted-foreground">{description}</p>
                    )}
                </div>
                {actions && (
                    <div className={cn(align === 'center' && 'w-full sm:w-auto')}>{actions}</div>
                )}
            </div>
        </div>
    );
}

