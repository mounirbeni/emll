'use client'

import { Facebook, Twitter, Linkedin, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ShareButtonsProps {
    title: string
    url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
    const handleShare = (platform: string) => {
        const encodedUrl = encodeURIComponent(url)
        const encodedTitle = encodeURIComponent(title)

        let shareLink = ''

        switch (platform) {
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
                break
            case 'twitter':
                shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
                break
            case 'linkedin':
                shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
                break
            case 'whatsapp':
                shareLink = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
                break
        }

        if (shareLink) {
            window.open(shareLink, '_blank', 'width=600,height=400')
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard')
    }

    return (
        <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-gray-900">Share this article</h3>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full hover:text-[#1877F2] hover:border-[#1877F2] hover:bg-[#1877F2]/10"
                    onClick={() => handleShare('facebook')}
                >
                    <Facebook className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full hover:text-[#1DA1F2] hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/10"
                    onClick={() => handleShare('twitter')}
                >
                    <Twitter className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full hover:text-[#0A66C2] hover:border-[#0A66C2] hover:bg-[#0A66C2]/10"
                    onClick={() => handleShare('linkedin')}
                >
                    <Linkedin className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full hover:text-gray-900 hover:border-gray-900 hover:bg-gray-100"
                    onClick={copyToClipboard}
                >
                    <Link2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
