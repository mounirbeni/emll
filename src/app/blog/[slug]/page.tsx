import { BLOG_POSTS } from "@/lib/data/blog-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { NewsletterForm } from "@/components/shared/NewsletterForm";

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = BLOG_POSTS.find(p => p.slug === slug);

    if (!post) {
        return notFound();
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Image */}
            <div className="relative w-full h-[50vh] md:h-[60vh] bg-gray-900">
                <Image
                    src={post.image === "IMAGE_PLACEHOLDER_PENDING_UPLOAD" ? "/images/placeholder-blog.svg" : post.image}
                    alt={post.title}
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />

                {/* Back Button */}
                <div className="absolute top-24 left-4 md:left-8 z-20">
                    <Link href="/blog" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-colors font-medium text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Journal
                    </Link>
                </div>

                {/* Hero Title Container */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10 max-w-[1400px] mx-auto">
                    <div className="max-w-4xl">
                        <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                            {post.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full border-2 border-white/20 bg-primary flex items-center justify-center text-white font-bold text-sm">
                                    {post.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <span className="font-bold">{post.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(post.publishedAt), "MMMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{post.readTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    {/* Article Content */}
                    <article className="lg:w-2/3">
                        <div
                            className="prose prose-lg md:prose-xl max-w-none text-gray-700
                            prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
                            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-gray-900
                            prose-blockquote:border-l-primary prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-gray-600
                            prose-img:rounded-2xl prose-img:shadow-xl
                            "
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Share Links */}
                        <div className="mt-12 border-t border-border pt-8">
                            <ShareButtons
                                title={post.title}
                                url={`https://marrakech-luxe.vercel.app/blog/${post.slug}`}
                            />
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:w-1/3 space-y-8 h-fit lg:sticky lg:top-28">
                        {/* Book Experience CTA */}
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-200/50">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Inspired to visit?</h3>
                            <p className="text-gray-600 mb-6">
                                Experience the real Marrakech with our curated guided tours and activities.
                            </p>
                            <Link href="/about" className="block">
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-brand">
                                    Learn More About Us
                                </Button>
                            </Link>
                        </div>

                        {/* Newsletter */}
                        <div className="surface-card p-8">
                            <h3 className="type-h4 mb-2">Join the Community</h3>
                            <p className="text-muted-foreground mb-4 text-sm">
                                Get travel tips and exclusive offers delivered to your inbox.
                            </p>
                            <NewsletterForm />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
