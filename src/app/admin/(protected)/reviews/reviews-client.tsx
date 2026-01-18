"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, Star, Trash2, CheckCircle, EyeOff, Search, Calendar, Filter } from "lucide-react"
import { toast } from "sonner"
import { updateReviewStatus, deleteReview, bulkReviewAction } from "@/app/actions/admin-actions"

interface Review {
    id: string
    rating: number
    comment: string
    status: string // "PENDING", "APPROVED", "HIDDEN"
    createdAt: Date
    user: {
        name: string | null
        email: string | null
        image: string | null
    }
    service: {
        title: string
    }
}

interface ReviewsClientProps {
    initialReviews: Review[]
}

export function ReviewsClient({ initialReviews }: ReviewsClientProps) {
    const router = useRouter()
    const [selectedReviews, setSelectedReviews] = useState<string[]>([])
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [searchQuery, setSearchQuery] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)

    // Client-side filtering
    const filteredReviews = initialReviews.filter(review => {
        const matchesStatus = statusFilter === "ALL" || review.status === statusFilter
        const matchesSearch = searchQuery === "" ||
            review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.service.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
    })

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedReviews(filteredReviews.map(r => r.id))
        } else {
            setSelectedReviews([])
        }
    }

    const handleSelectReview = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedReviews(prev => [...prev, id])
        } else {
            setSelectedReviews(prev => prev.filter(r => r !== id))
        }
    }

    const handleBulkAction = async (action: 'approve' | 'hide' | 'delete') => {
        if (selectedReviews.length === 0) return
        setIsUpdating(true)
        try {
            const result = await bulkReviewAction(selectedReviews, action)
            if (result.success) {
                toast.success(`Successfully processed ${result.updatedCount} reviews`)
                setSelectedReviews([])
                router.refresh()
            } else {
                toast.error(result.error || "Bulk action failed")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleStatusUpdate = async (id: string, status: string) => { // Status is enum in backend but string here
        // We use ReviewStatus enum in server action, which strings map to
        try {
            const result = await updateReviewStatus(id, status as any)
            if (result.success) {
                toast.success(`Review status updated to ${status}`)
                router.refresh()
            } else {
                toast.error(result.error || "Update failed")
            }
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteReview(id)
            if (result.success) {
                toast.success("Review deleted")
                router.refresh()
            } else {
                toast.error(result.error || "Delete failed")
            }
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
            case "APPROVED":
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>
            case "HIDDEN":
                return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">Hidden</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            {/* Filters and Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 bg-card p-4 rounded-lg border shadow-sm">
                <div className="flex flex-1 gap-4 items-center">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search reviews, users, or services..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="APPROVED">Approved</SelectItem>
                            <SelectItem value="HIDDEN">Hidden</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {selectedReviews.length > 0 && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5">
                        <span className="text-sm text-muted-foreground mr-2">{selectedReviews.length} selected</span>
                        <Button size="sm" variant="outline" className="border-green-200 hover:bg-green-50 text-green-700" onClick={() => handleBulkAction('approve')} disabled={isUpdating}>
                            <CheckCircle className="w-4 h-4 mr-2" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-200 hover:bg-gray-100 text-gray-700" onClick={() => handleBulkAction('hide')} disabled={isUpdating}>
                            <EyeOff className="w-4 h-4 mr-2" /> Hide
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-200 hover:bg-red-50 text-red-700" onClick={() => handleBulkAction('delete')} disabled={isUpdating}>
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                    </div>
                )}
            </div>

            {/* Reviews Table */}
            <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={selectedReviews.length === filteredReviews.length && filteredReviews.length > 0}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead className="w-[100px]">Date</TableHead>
                            <TableHead className="w-[200px]">User</TableHead>
                            <TableHead className="w-[200px]">Service</TableHead>
                            <TableHead className="w-[100px]">Rating</TableHead>
                            <TableHead>Comment</TableHead>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReviews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                                    No reviews found matching your filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredReviews.map((review) => (
                                <TableRow key={review.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedReviews.includes(review.id)}
                                            onCheckedChange={(checked) => handleSelectReview(review.id, checked as boolean)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        <div className="flex flex-col">
                                            <span>{format(new Date(review.createdAt), 'MMM d, yyyy')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{review.user.name || "Anonymous"}</div>
                                        <div className="text-xs text-muted-foreground">{review.user.email}</div>
                                    </TableCell>
                                    <TableCell className="truncate max-w-[200px]">
                                        <span className="text-sm">{review.service.title}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-yellow-500">
                                            <span className="font-bold mr-1">{review.rating}</span>
                                            <Star className="w-3 h-3 fill-current" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[400px]">
                                        <p className="text-sm truncate hover:whitespace-normal hover:bg-muted/50 p-1 rounded transition-colors cursor-default" title={review.comment}>
                                            {review.comment}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(review.status)}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleStatusUpdate(review.id, 'APPROVED')}>
                                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                                    Approve
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusUpdate(review.id, 'HIDDEN')}>
                                                    <EyeOff className="mr-2 h-4 w-4 text-gray-500" />
                                                    Hide
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleDelete(review.id)} className="text-destructive focus:text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
