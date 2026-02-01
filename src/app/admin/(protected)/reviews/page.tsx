import type { Metadata } from 'next';
import AdminReviewsClient from './reviews-client';

export const metadata: Metadata = {
    title: 'Reviews - Admin Dashboard',
};

export default function AdminReviewsPage() {
    return <AdminReviewsClient />;
}
