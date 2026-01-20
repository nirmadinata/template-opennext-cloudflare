import { cn } from "@/lib/utils";

interface AuthHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
}

export function AuthHeader({
    title,
    description,
    className,
    ...props
}: AuthHeaderProps) {
    return (
        <div
            className={cn("flex flex-col space-y-2 text-center", className)}
            {...props}
        >
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description && (
                <p className="text-muted-foreground text-sm">{description}</p>
            )}
        </div>
    );
}
