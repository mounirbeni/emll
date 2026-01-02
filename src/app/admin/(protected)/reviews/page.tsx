'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Filter, CheckCircle, XCircle, Trash2, Star, Calendar, Eye, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

interface Review {
    id: string
    rating: number
    comment: string
    createdAt: string
    status: 'PENDING' | 'APPROVED' | 'HIDDEN'
    user: {
        name: string | null
        email: string
    }
    service: {
        id: string
        title: string
    }
    booking: {
        id: string
        date: string
    }
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'APPROVED' | 'HIDDEN'>('all')
    const [selectedReviews, setSelectedReviews] = useState<string[]>([])
    const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false)
    const [bulkAction, setBulkAction] = useState<'approve' | 'hide' | 'delete' | null>(null)
    const [processing, setProcessing] = useState(false)

    const fetchReviews = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (searchQuery) params.set('search', searchQuery)
            if (statusFilter !== 'all') params.set('status', statusFilter)

            const res = await fetch(`/api/admin/reviews?${params.toString()}`)
            if (!res.ok) throw new Error('Failed to fetch reviews')
            const data = await res.json()
            setReviews(data.data || [])
        } catch (error) {
            console.error('Failed to fetch reviews', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [searchQuery, statusFilter])

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedReviews(reviews.map(r => r.id))
        } else {
            setSelectedReviews([])
        }
    }

    const handleSelectReview = (reviewId: string, checked: boolean) => {
        if (checked) {
            setSelectedReviews(prev => [...prev, reviewId])
        } else {
            setSelectedReviews(prev => prev.filter(id => id !== reviewId))
        }
    }

    const handleBulkAction = async () => {
        if (!bulkAction || selectedReviews.length === 0) return

        setProcessing(true)
        try {
            const res = await fetch('/api/admin/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reviewIds: selectedReviews,
                    action: bulkAction
                })
            })

            if (!res.ok) throw new Error('Failed to perform action')
            const result = await res.json()

            toast.success(`${bulkAction === 'approve' ? 'Approved' : bulkAction === 'hide' ? 'Hidden' : 'Deleted'} ${result.updatedCount} reviews`)
            setSelectedReviews([])
            setBulkActionDialogOpen(false)
            setBulkAction(null)
            fetchReviews()
        } catch (error: any) {
            console.error('Bulk action failed', error)
            toast.error(error.message || 'Failed to perform action')
        } finally {
            setProcessing(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <Badge className="bg-green-100 text-green-800">Approved</Badge>
            case 'HIDDEN':
                return <Badge variant="secondary">Hidden</Badge>
            case 'PENDING':
            default:
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <CheckCircle className="h-4 w-4 text-green-600" />
            case 'HIDDEN':
                return <XCircle className="h-4 w-4 text-gray-600" />
            case 'PENDING':
            default:
                return <MessageSquare className="h-4 w-4 text-yellow-600" />
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="flex gap-4">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Review</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-12 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-charcoal">Review Moderation</h1>
                    <p className="text-sm text-medium-gray">Manage and moderate customer reviews</p>
                </div>
                {selectedReviews.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-medium-gray">
                            {selectedReviews.length} selected
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setBulkAction('approve')
                                setBulkActionDialogOpen(true)
                            }}
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setBulkAction('hide')
                                setBulkActionDialogOpen(true)
                            }}
                        >
                            <XCircle className="h-4 w-4 mr-2" />
                            Hide
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                setBulkAction('delete')
                                setBulkActionDialogOpen(true)
                            }}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search reviews..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="HIDDEN">Hidden</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Reviews Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedReviews.length === reviews.length && reviews.length > 0}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Review</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-medium-gray">
                                    No reviews found
                                </TableCell>
                            </TableRow>
                        ) : (
                            reviews.map((review) => (
                                <TableRow key={review.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedReviews.includes(review.id)}
                                            onCheckedChange={(checked) => handleSelectReview(review.id, checked as boolean)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${
                                                                i < review.rating
                                                                    ? 'text-yellow-500 fill-current'
                                                                    : 'text-gray-300'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                {getStatusIcon(review.status)}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-medium text-charcoal">
                                                    {review.user.name || 'Anonymous'}
                                                </span>
                                                <span className="text-medium-gray">•</span>
                                                <span className="text-medium-gray">{review.user.email}</span>
                                            </div>
                                            <p className="text-sm text-medium-gray line-clamp-2">
                                                {review.comment}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/services/${review.service.id}`}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            {review.service.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(review.status)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-medium-gray">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={`/services/${review.service.id}#reviews`} target="_blank">
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Bulk Action Confirmation Dialog */}
            <Dialog open={bulkActionDialogOpen} onOpenChange={setBulkActionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {bulkAction === 'approve' && 'Approve Reviews'}
                            {bulkAction === 'hide' && 'Hide Reviews'}
                            {bulkAction === 'delete' && 'Delete Reviews'}
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to {bulkAction} {selectedReviews.length} review(s)?
                            {bulkAction === 'delete' && ' This action cannot be undone.'}
                            {bulkAction === 'approve' && ' Approved reviews will be visible to customers and affect service ratings.'}
                            {bulkAction === 'hide' && ' Hidden reviews will not be visible to customers and will not affect service ratings.'}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBulkActionDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant={bulkAction === 'delete' ? 'destructive' : 'default'}
                            onClick={handleBulkAction}
                            disabled={processing}
                        >
                            {processing ? 'Processing...' : `${bulkAction === 'approve' ? 'Approve' : bulkAction === 'hide' ? 'Hide' : 'Delete'} ${selectedReviews.length} Review(s)`}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
