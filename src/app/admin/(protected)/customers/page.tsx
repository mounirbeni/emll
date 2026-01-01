'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { 
    Search, 
    Mail, 
    User as UserIcon, 
    Download, 
    Eye,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Calendar,
    DollarSign,
    Package,
    TrendingUp,
    Filter,
    X,
    Phone,
    Star,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from 'sonner'

interface Customer {
    id: string
    name: string | null
    email: string
    role: string
    createdAt: string
    source: string
    bookingsCount: number
    totalSpent: number
    statusBreakdown: {
        PENDING: number
        CONFIRMED: number
        COMPLETED: number
        CANCELLED: number
    }
    lastBookingDate: string | null
}

interface CustomerDetail extends Customer {
    phone?: string | null
    loyaltyPoints?: number
    canMessage?: boolean
    avgBookingValue?: number
    firstBookingDate?: string | null
    totalReviews?: number
    recentBookings: Array<{
        id: string
        activityTitle: string
        date: string
        status: string
        totalPrice: number
        guests: number
        createdAt: string
        paymentStatus?: string
    }>
}

interface CustomersResponse {
    customers: Customer[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export default function CustomersPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<CustomersResponse | null>(null)
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null)
    const [detailLoading, setDetailLoading] = useState(false)
    const [showDetailDialog, setShowDetailDialog] = useState(false)

    const fetchCustomers = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '50',
                sortBy,
                sortOrder
            })
            if (searchQuery) {
                params.append('search', searchQuery)
            }

            const res = await fetch(`/api/admin/customers?${params}`)
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                const errorMessage = errorData?.error?.message || `HTTP ${res.status}: Failed to fetch customers`
                console.error('Customers API error:', errorMessage, errorData)
                throw new Error(errorMessage)
            }
            const response = await res.json()
            setData(response.data || response)
        } catch (error) {
            console.error('Error fetching customers:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            toast.error(`Failed to load customers: ${errorMessage}`)
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, [page, sortBy, sortOrder, searchQuery])

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(field)
            setSortOrder('desc')
        }
    }

    const handleViewDetails = async (customer: Customer) => {
        try {
            setDetailLoading(true)
            setShowDetailDialog(true)
            const res = await fetch(`/api/admin/customers/${customer.id}`)
            if (!res.ok) throw new Error('Failed to fetch customer details')
            const response = await res.json()
            setSelectedCustomer(response.data || response)
        } catch (error) {
            console.error('Error fetching customer details:', error)
            toast.error('Failed to load customer details')
        } finally {
            setDetailLoading(false)
        }
    }

    const handleSuspend = async (userId: string) => {
        if (!confirm("Are you sure you want to suspend this customer?")) return
        try {
            const res = await fetch(`/api/admin/customers/${userId}/suspend`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ suspended: true }),
            })
            if (res.ok) {
                toast.success('Customer suspended successfully')
                fetchCustomers()
            } else {
                toast.error('Failed to suspend customer')
            }
        } catch (error) {
            toast.error('Error suspending customer')
        }
    }

    const exportCustomers = async () => {
        try {
            const res = await fetch('/api/admin/customers?limit=10000')
            if (!res.ok) throw new Error('Failed to export')
            const response = await res.json()
            const customers = response.data?.customers || response.customers || []

            const csv = [
                ['Name', 'Email', 'Bookings', 'Total Spent', 'Joined Date'].join(','),
                ...customers.map((c: Customer) => [
                    c.name || 'N/A',
                    c.email,
                    c.bookingsCount,
                    c.totalSpent || 0,
                    new Date(c.createdAt).toLocaleDateString()
                ].join(','))
            ].join('\n')

            const blob = new Blob([csv], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `customers-${format(new Date(), 'yyyy-MM-dd')}.csv`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast.success('Customers exported successfully')
        } catch (error) {
            toast.error('Failed to export customers')
        }
    }

    const customers = data?.customers || []
    const stats = {
        total: data?.pagination.total || 0,
        totalSpent: customers.reduce((sum, c) => sum + c.totalSpent, 0),
        totalBookings: customers.reduce((sum, c) => sum + c.bookingsCount, 0),
        avgSpent: customers.length > 0 ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length : 0
    }

    const SortIcon = ({ field }: { field: string }) => {
        if (sortBy !== field) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />
        return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
                    <p className="text-muted-foreground">Manage and view all registered customers</p>
                </div>
                <Button onClick={exportCustomers}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">Registered users</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{stats.totalSpent.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">From all customers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalBookings}</div>
                        <p className="text-xs text-muted-foreground">All time bookings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Customer Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{stats.avgSpent.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Per customer</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Customers</CardTitle>
                    <CardDescription>Search, filter, and manage your customer base</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setPage(1)
                                }}
                                className="pl-8"
                            />
                        </div>
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSearchQuery('')}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Clear
                            </Button>
                        )}
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <button
                                            onClick={() => handleSort('name')}
                                            className="flex items-center hover:text-foreground"
                                        >
                                            Customer
                                            <SortIcon field="name" />
                                        </button>
                                    </TableHead>
                                    <TableHead>
                                        <button
                                            onClick={() => handleSort('createdAt')}
                                            className="flex items-center hover:text-foreground"
                                        >
                                            Joined
                                            <SortIcon field="createdAt" />
                                        </button>
                                    </TableHead>
                                    <TableHead>
                                        <button
                                            onClick={() => handleSort('bookings')}
                                            className="flex items-center hover:text-foreground"
                                        >
                                            Bookings
                                            <SortIcon field="bookings" />
                                        </button>
                                    </TableHead>
                                    <TableHead>
                                        <button
                                            onClick={() => handleSort('totalSpent')}
                                            className="flex items-center hover:text-foreground"
                                        >
                                            Total Spent
                                            <SortIcon field="totalSpent" />
                                        </button>
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : customers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            No customers found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    customers.map((customer) => (
                                        <TableRow key={customer.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={`https://avatar.vercel.sh/${customer.email}`} />
                                                        <AvatarFallback>
                                                            {customer.name?.charAt(0) || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">
                                                            {customer.name || 'Unnamed User'}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {customer.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {format(new Date(customer.createdAt), 'PPP')}
                                                </div>
                                                {customer.lastBookingDate && (
                                                    <div className="text-xs text-muted-foreground">
                                                        Last booking: {format(new Date(customer.lastBookingDate), 'MMM d, yyyy')}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{customer.bookingsCount}</div>
                                                <div className="text-xs text-muted-foreground space-x-1">
                                                    <span className="text-blue-600">{customer.statusBreakdown.CONFIRMED}</span>
                                                    <span>/</span>
                                                    <span className="text-green-600">{customer.statusBreakdown.COMPLETED}</span>
                                                    <span>/</span>
                                                    <span className="text-gray-600">{customer.statusBreakdown.PENDING}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">€{customer.totalSpent.toFixed(2)}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    customer.statusBreakdown.COMPLETED > 0 ? 'default' :
                                                    customer.statusBreakdown.CONFIRMED > 0 ? 'secondary' : 'outline'
                                                }>
                                                    {customer.statusBreakdown.COMPLETED > 0 ? 'Active' :
                                                     customer.statusBreakdown.CONFIRMED > 0 ? 'Pending' : 'New'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => handleViewDetails(customer)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        onClick={() => window.location.href = `mailto:${customer.email}`}
                                                    >
                                                        <Mail className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {data?.pagination && data.pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {((page - 1) * data.pagination.limit) + 1} to{' '}
                                {Math.min(page * data.pagination.limit, data.pagination.total)} of{' '}
                                {data.pagination.total} customers
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                                    disabled={page === data.pagination.totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Customer Detail Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Customer Details</DialogTitle>
                        <DialogDescription>
                            Comprehensive customer information and activity overview
                        </DialogDescription>
                    </DialogHeader>
                    {detailLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-center">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                <p className="text-sm text-muted-foreground">Loading customer details...</p>
                            </div>
                        </div>
                    ) : selectedCustomer ? (
                        <div className="space-y-6">
                            {/* Customer Header */}
                            <div className="flex items-start justify-between border-b pb-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={`https://avatar.vercel.sh/${selectedCustomer.email}`} />
                                        <AvatarFallback className="text-2xl">
                                            {selectedCustomer.name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-2xl font-bold">{selectedCustomer.name || 'Unnamed User'}</h3>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Mail className="h-4 w-4" />
                                                <a href={`mailto:${selectedCustomer.email}`} className="hover:text-primary">
                                                    {selectedCustomer.email}
                                                </a>
                                            </div>
                                            {selectedCustomer.phone && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone className="h-4 w-4" />
                                                    <a href={`tel:${selectedCustomer.phone}`} className="hover:text-primary">
                                                        {selectedCustomer.phone}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                            <span>Member since {format(new Date(selectedCustomer.createdAt), 'PPP')}</span>
                                            {selectedCustomer.firstBookingDate && (
                                                <span>• First booking {format(new Date(selectedCustomer.firstBookingDate), 'MMM yyyy')}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => window.location.href = `mailto:${selectedCustomer.email}`}
                                    >
                                        <Mail className="h-4 w-4 mr-2" />
                                        Email
                                    </Button>
                                    {selectedCustomer.phone && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => window.location.href = `tel:${selectedCustomer.phone}`}
                                        >
                                            <Phone className="h-4 w-4 mr-2" />
                                            Call
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <Package className="h-4 w-4" />
                                            Total Bookings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{selectedCustomer.bookingsCount}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {selectedCustomer.avgBookingValue ? `Avg: €${selectedCustomer.avgBookingValue.toFixed(2)}` : 'No bookings'}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <DollarSign className="h-4 w-4" />
                                            Total Spent
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">€{selectedCustomer.totalSpent.toFixed(2)}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Lifetime value
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <Star className="h-4 w-4" />
                                            Reviews
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{selectedCustomer.totalReviews || 0}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Customer reviews
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4" />
                                            Loyalty Points
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{selectedCustomer.loyaltyPoints || 0}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Points earned
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Booking Status Breakdown */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Booking Status Overview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Clock className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold">{selectedCustomer.statusBreakdown.PENDING}</div>
                                                <div className="text-xs text-muted-foreground">Pending</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                                            <div className="p-2 bg-yellow-100 rounded-lg">
                                                <AlertCircle className="h-5 w-5 text-yellow-600" />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold">{selectedCustomer.statusBreakdown.CONFIRMED}</div>
                                                <div className="text-xs text-muted-foreground">Confirmed</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold">{selectedCustomer.statusBreakdown.COMPLETED}</div>
                                                <div className="text-xs text-muted-foreground">Completed</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                                            <div className="p-2 bg-red-100 rounded-lg">
                                                <XCircle className="h-5 w-5 text-red-600" />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold">{selectedCustomer.statusBreakdown.CANCELLED}</div>
                                                <div className="text-xs text-muted-foreground">Cancelled</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Bookings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Recent Bookings</CardTitle>
                                    <CardDescription>Last 10 bookings for this customer</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {selectedCustomer.recentBookings && selectedCustomer.recentBookings.length > 0 ? (
                                            selectedCustomer.recentBookings.map((booking) => (
                                                <div 
                                                    key={booking.id} 
                                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className="font-semibold">{booking.activityTitle}</div>
                                                            <Badge variant="outline" className="text-xs">
                                                                {booking.id}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {format(new Date(booking.date), 'PPP')}
                                                            </div>
                                                            <div>•</div>
                                                            <div>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</div>
                                                            <div>•</div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <div className="font-bold text-lg">€{booking.totalPrice.toFixed(2)}</div>
                                                            {booking.paymentStatus && (
                                                                <Badge 
                                                                    variant={booking.paymentStatus === 'PAID' ? 'default' : 'secondary'}
                                                                    className="text-xs mt-1"
                                                                >
                                                                    {booking.paymentStatus}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <Badge variant={
                                                            booking.status === 'COMPLETED' ? 'default' :
                                                            booking.status === 'CONFIRMED' ? 'secondary' :
                                                            booking.status === 'CANCELLED' ? 'destructive' : 'outline'
                                                        }>
                                                            {booking.status}
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => window.location.href = `/admin/bookings?search=${booking.id}`}
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                                <p>No bookings yet</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        </div>
    )
}
