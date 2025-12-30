"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, MessageSquare, ArrowLeft, XCircle, Trash2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationSummary {
    id: string;
    subject: string;
    status: string;
    updatedAt: string;
    lastMessage: string;
    lastMessageTime: string;
    userName: string;
    userEmail: string;
    unreadCount: number;
    userId: string;
}

interface MessageData {
    id: string;
    content: string;
    sender: string;
    createdAt: string;
}

export default function AdminMessagesPage() {
    const router = useRouter();
    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<ConversationSummary | null>(null);
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (!data.user || data.user.role !== 'ADMIN') {
                    router.push('/admin');
                } else {
                    fetchConversations();
                }
            });
    }, [router]);

    useEffect(() => {
        if (selectedConversation) {
            const interval = setInterval(() => {
                fetchMessages(selectedConversation.id);
                fetchConversations(); // Refresh to get updated status
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [selectedConversation]);

    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/admin/conversations');
            if (res.ok) {
                const data = await res.json();
                setConversations(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMessages = async (conversationId: string) => {
        try {
            const res = await fetch(`/api/admin/messages/${conversationId}`);
            if (res.ok) {
                setMessages(await res.json());
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectConversation = (conv: ConversationSummary) => {
        setSelectedConversation(conv);
        fetchMessages(conv.id);
    };

    const handleCloseConversation = async () => {
        if (!selectedConversation || !confirm('Close this conversation? The user will no longer be able to send messages to this ticket.')) return;

        try {
            const res = await fetch(`/api/admin/conversations/${selectedConversation.id}/close`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'close' })
            });

            if (res.ok) {
                toast.success("Conversation closed");
                fetchConversations();
                fetchMessages(selectedConversation.id);
            } else {
                const errorData = await res.json();
                console.error('Close error:', errorData);
                toast.error(errorData.details || errorData.error || "Failed to close conversation");
            }
        } catch (error) {
            console.error('Close exception:', error);
            toast.error("Failed to close conversation");
        }
    };

    const handleReopenConversation = async () => {
        if (!selectedConversation || !confirm('Reopen this conversation? The user will be able to send messages again.')) return;

        try {
            const res = await fetch(`/api/admin/conversations/${selectedConversation.id}/close`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reopen' })
            });

            if (res.ok) {
                toast.success("Conversation reopened");
                fetchConversations();
                fetchMessages(selectedConversation.id);
            } else {
                const errorData = await res.json();
                toast.error(errorData.details || errorData.error || "Failed to reopen conversation");
            }
        } catch (error) {
            toast.error("Failed to reopen conversation");
        }
    };

    const handleDeleteConversation = async () => {
        if (!selectedConversation || !confirm('Delete this entire conversation? This action cannot be undone.')) return;

        try {
            const res = await fetch(`/api/admin/conversations/${selectedConversation.userId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success("Conversation deleted");
                setSelectedConversation(null);
                fetchConversations();
            } else {
                toast.error("Failed to delete conversation");
            }
        } catch (error) {
            toast.error("Failed to delete conversation");
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        setSending(true);
        try {
            const res = await fetch(`/api/admin/messages/${selectedConversation.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage })
            });

            if (res.ok) {
                const msg = await res.json();
                setMessages([...messages, msg]);
                setNewMessage("");
            } else {
                toast.error("Failed to send message");
            }
        } finally {
            setSending(false);
        }
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6 flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.push('/admin')}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Support Messages</h1>
                    <p className="text-muted-foreground">Respond to client inquiries</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* Conversations List */}
                <Card className="md:col-span-1 overflow-hidden flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg">Conversations ({conversations.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-0">
                        {conversations.length === 0 ? (
                            <div className="p-6 text-center text-muted-foreground">
                                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No conversations yet</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => handleSelectConversation(conv)}
                                    className={cn(
                                        "w-full p-4 border-b text-left transition-colors hover:bg-secondary",
                                        selectedConversation?.id === conv.id && "bg-secondary"
                                    )}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{conv.subject}</div>
                                            <div className="text-xs text-muted-foreground">{conv.userName}</div>
                                        </div>
                                        <div className="flex flex-col gap-1 items-end">
                                            {conv.unreadCount > 0 && (
                                                <Badge className="bg-primary text-xs">{conv.unreadCount}</Badge>
                                            )}
                                            <Badge variant={conv.status === 'OPEN' ? 'default' : 'secondary'} className="text-xs">
                                                {conv.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1 truncate">
                                        {conv.lastMessage}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {format(new Date(conv.lastMessageTime), "PPp")}
                                    </div>
                                </button>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Chat Window */}
                <Card className="md:col-span-2 flex flex-col overflow-hidden">
                    {!selectedConversation ? (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>Select a conversation to start messaging</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <CardHeader className="border-b">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-lg">{selectedConversation.subject}</CardTitle>
                                            <Badge variant={selectedConversation.status === 'OPEN' ? 'default' : 'secondary'}>
                                                {selectedConversation.status}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {selectedConversation.userName} ({selectedConversation.userEmail})
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {selectedConversation.status === 'OPEN' ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleCloseConversation}
                                                className="gap-1"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Close
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleReopenConversation}
                                                className="gap-1"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Reopen
                                            </Button>
                                        )}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleDeleteConversation}
                                            className="gap-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'ADMIN' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={cn(
                                            "max-w-[80%] rounded-lg p-3",
                                            msg.sender === 'ADMIN'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted'
                                        )}>
                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                            <span className="text-[10px] opacity-70 block mt-1">
                                                {format(new Date(msg.createdAt), "p")}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                            <div className="p-4 border-t">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your response..."
                                        disabled={sending}
                                    />
                                    <Button type="submit" disabled={sending || !newMessage.trim()}>
                                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    </Button>
                                </form>
                            </div>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
}
