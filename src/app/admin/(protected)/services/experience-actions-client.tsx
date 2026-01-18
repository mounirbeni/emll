'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteExperience, activateExperience, deactivateExperience } from "@/app/actions/admin-actions";
import { useRouter } from "next/navigation";

interface ExperienceActionsProps {
    id: string;
    isActive: boolean;
}

export function ExperienceActions({ id, isActive }: ExperienceActionsProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleAction = async (actionFn: (id: string) => Promise<any>, successMessage: string) => {
        startTransition(async () => {
            const result = await actionFn(id);
            if (result.success) {
                toast.success(successMessage);
                router.refresh();
            } else {
                toast.error(result.error || "Action failed");
            }
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/admin/services/${id}`} className="flex items-center cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </Link>
                </DropdownMenuItem>

                {isActive ? (
                    <DropdownMenuItem
                        disabled={isPending}
                        onClick={() => handleAction(deactivateExperience, 'Experience deactivated')}
                    >
                        <XCircle className="mr-2 h-4 w-4 text-orange-500" />
                        Deactivate
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        disabled={isPending}
                        onClick={() => handleAction(activateExperience, 'Experience activated')}
                    >
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        Activate
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    disabled={isPending}
                    onClick={() => {
                        if (confirm('Are you sure you want to delete this experience? This cannot be undone.')) {
                            handleAction(deleteExperience, 'Experience deleted');
                        }
                    }}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
