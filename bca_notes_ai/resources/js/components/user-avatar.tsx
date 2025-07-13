import { User } from 'lucide-react';
import { type User as UserType } from '@/types';

type UserAvatarProps = {
    user?: UserType | null;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
};

export default function UserAvatar({ user, size = 'md', className = '' }: UserAvatarProps) {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (!user) {
        return (
            <div className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center ${className} dark:bg-gray-700`}>
                <User className={`${size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : 'h-8 w-8'} text-gray-500 dark:text-gray-400`} />
            </div>
        );
    }

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold ${className}`}>
            {getInitials(user.name)}
        </div>
    );
} 