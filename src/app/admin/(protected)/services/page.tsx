'use client'

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import Image from 'next/image'
import { Plus, Pencil, Trash2, MoreHorizontal, Search, Filter, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Service } from '@/types/admin'
import Link from 'next/link'

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    // Handle both direct array and wrapped response (from successResponse)
    const services = Array.isArray(data) ? data : (data.data || data)
    // Services already have native arrays from Prisma, no parsing needed
    return Array.isArray(services) ? services : []
}

export default function ServicesPage() {
    const { data: services, error, isLoading } = useSWR<Service[]>('/api/admin/services', fetcher)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingService, setEditingService] = useState<Service | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('ALL')

    const handleCreate = async (data: Omit<Service, 'id'> | Partial<Service>) => {
        await fetch('/api/admin/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        mutate('/api/admin/services')
        setIsDialogOpen(false)
    }

    const handleUpdate = async (data: Omit<Service, 'id'> | Partial<Service>) => {
        if (!editingService) return
        await fetch(`/api/admin/services/${editingService.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        mutate('/api/admin/services')
        setIsDialogOpen(false)
        setEditingService(null)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return
        await fetch(`/api/admin/services/${id}`, {
            method: 'DELETE',
        })
        mutate('/api/admin/services')
    }

    // Client-side filtering
    const filteredServices = services?.filter((service) => {
        const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = categoryFilter === 'ALL' || service.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    const categories = Array.from(new Set(services?.map(s => s.category) || []))

    if (error) {
        return (
            <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-destructive">Failed to load services</p>
                    <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </Button>
                </div>
            </div>
        )
    }
    if (isLoading) {
        return (
            <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Loading services...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Services</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Manage your services and experiences.
                    </p>
                </div>
                <Link href="/admin/services/new">
                    <Button className="w-full sm:w-auto text-sm sm:text-base">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Service
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Services</CardTitle>
                    <CardDescription>
                        A list of all available services.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2 flex-1 w-full md:max-w-sm">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search services..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        <SelectValue placeholder="Filter by category" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Categories</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {(searchQuery || categoryFilter !== 'ALL') && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setSearchQuery('')
                                        setCategoryFilter('ALL')
                                    }}
                                    className="h-8 px-2 lg:px-3"
                                >
                                    Reset
                                    <XCircle className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block md:hidden space-y-4">
                        {filteredServices && filteredServices.length > 0 ? (
                            filteredServices.map((service) => (
                                <Card key={service.id} className="overflow-hidden">
                                    <div className="flex gap-4 p-4">
                                        {service.images[0] && (
                                            <div className="relative h-20 w-20 flex-shrink-0 rounded overflow-hidden">
                                                <Image
                                                    src={service.images[0]}
                                                    alt={service.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="80px"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm truncate">{service.title}</h3>
                                            <p className="text-xs text-muted-foreground mt-1">{service.category}</p>
                                            <p className="text-sm font-bold mt-2">€{service.price.toFixed(2)}</p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/services/${service.id}`} className="flex items-center">
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(service.id)} className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>No services found.</p>
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-20">Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredServices?.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell>
                                            {service.images[0] && (
                                                <div className="relative h-10 w-16 rounded overflow-hidden">
                                                    <Image
                                                        src={service.images[0]}
                                                        alt={service.title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="64px"
                                                    />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{service.title}</TableCell>
                                        <TableCell>{service.category}</TableCell>
                                        <TableCell>€{service.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
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
                                                        <Link href={`/admin/services/${service.id}`} className="flex items-center">
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(service.id)} className="text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredServices?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No services found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
