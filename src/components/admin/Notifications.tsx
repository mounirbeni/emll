'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Bell, CheckCheck } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Notification } from '@/types/admin'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const fetcher = async (url: string) => {
    const res = await fetch(url)
    return res.json()
}

export function Notifications() {
    const { data: notifications, mutate } = useSWR<Notification[]>('/api/admin/notifications', fetcher, {
        refreshInterval: 30000 // Poll every 30 seconds
    })
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    const unreadCount = notifications?.filter(n => !n.read).length || 0

    const handleNotificationClick = (notification: Notification) => {
        setIsOpen(false)
        if (notification.link) {
            router.push(notification.link)
        }
    }

    const handleMarkAllAsRead = async () => {
        // Optimistic update
        const updatedNotifications = notifications?.map(n => ({ ...n, read: true })) || []

        try {
            // Update local state immediately
            await mutate(updatedNotifications, false)
            toast.success('All notifications marked as read')

            const res = await fetch('/api/admin/notifications', {
                method: 'PATCH',
            })

            if (!res.ok) throw new Error('Failed to mark all as read')

            // Revalidate to ensure sync with server
            mutate()
        } catch (error) {
            toast.error('Failed to mark all notifications as read')
            console.error('[MARK_ALL_AS_READ]', error)
            // Rollback on error
            mutate()
        }
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-0 text-[10px]"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-2 py-1.5">
                    <DropdownMenuLabel className="py-0">Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAllAsRead()
                            }}
                        >
                            <CheckCheck className="h-3 w-3 mr-1" />
                            Mark all as read
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications?.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No new notifications
                        </div>
                    ) : (
                        notifications?.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex w-full items-center justify-between">
                                    <span className="font-semibold text-sm">{notification.title}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {notification.message}
                                </p>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
