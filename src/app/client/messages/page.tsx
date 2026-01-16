"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Message {
    id: string;
    content: string;
    sender: string;
    createdAt: string;
    read: boolean;
}

interface Conversation {
    id: string;
    subject: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    messages: Message[];
}

export default function MessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] =
        useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newSubject, setNewSubject] = useState("");
    const [newContent, setNewContent] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (activeConversation) {
            fetchConversationMessages(activeConversation.id);
        }
    }, [activeConversation?.id]);

    useEffect(() => {
        scrollToBottom();
    }, [activeConversation?.messages]);

    const fetchConversationMessages = async (conversationId: string) => {
        try {
            const res = await fetch(`/api/conversations/${conversationId}/messages`);
            if (!res.ok) throw new Error("Failed to fetch messages");
            const data = await res.json();
            const messages = data.data || data;
            setActiveConversation(prev => prev ? { ...prev, messages } : null);
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Failed to load messages");
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        try {
            const res = await fetch("/api/conversations");
            if (!res.ok) throw new Error("Failed to fetch conversations");
            const data = await res.json();
            // Handle wrapped response
            const conversationsData = data.data || data;
            setConversations(conversationsData);
            if (conversationsData.length > 0 && !activeConversation) {
                setActiveConversation(conversationsData[0]);
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
            toast.error("Failed to load messages");
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation) return;

        setSending(true);
        try {
            const res = await fetch(
                `/api/conversations/${activeConversation.id}/messages`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: newMessage }),
                }
            );

            if (!res.ok) throw new Error("Failed to send message");

            setNewMessage("");
            // Refresh messages for the active conversation
            await fetchConversationMessages(activeConversation.id);
            // Refresh conversations list
            await fetchConversations();
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const handleCreateConversation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubject.trim() || !newContent.trim()) return;

        try {
            const res = await fetch("/api/conversations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject: newSubject, content: newContent }),
            });

            if (!res.ok) throw new Error("Failed to create conversation");

            toast.success("Conversation created successfully");
            setNewSubject("");
            setNewContent("");
            setDialogOpen(false);
            await fetchConversations();
        } catch (error) {
            console.error("Error creating conversation:", error);
            toast.error("Failed to create conversation");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading messages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                    <p className="text-gray-600 mt-1">
                        Chat with our support team
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            New Conversation
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Start New Conversation</DialogTitle>
                            <DialogDescription>
                                Create a new support ticket to get help
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateConversation} className="space-y-4">
                            <div>
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                    placeholder="What do you need help with?"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    placeholder="Describe your issue..."
                                    rows={4}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Create Conversation
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {conversations.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No conversations yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Start a conversation to get help from our support team
                        </p>
                        <Button onClick={() => setDialogOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Start Conversation
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Conversations List */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Conversations</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {conversations.map((conv) => (
                                    <button
                                        key={conv.id}
                                        onClick={() => setActiveConversation(conv)}
                                        className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${activeConversation?.id === conv.id ? "bg-orange-50" : ""
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-1">
                                            <h4 className="font-medium text-gray-900 text-sm">
                                                {conv.subject}
                                            </h4>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded ${conv.status === "OPEN"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {conv.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {new Date(conv.updatedAt).toLocaleDateString()}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Conversation */}
                    <Card className="lg:col-span-2">
                        {activeConversation ? (
                            <>
                                <CardHeader className="border-b">
                                    <CardTitle>{activeConversation.subject}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                                        {activeConversation.messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.sender === "USER"
                                                        ? "justify-end"
                                                        : "justify-start"
                                                    }`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-lg p-3 ${message.sender === "USER"
                                                            ? "bg-[#FF5F00] text-white"
                                                            : "bg-gray-100 text-gray-900"
                                                        }`}
                                                >
                                                    <p className="text-sm">{message.content}</p>
                                                    <p
                                                        className={`text-xs mt-1 ${message.sender === "USER"
                                                                ? "text-orange-100"
                                                                : "text-gray-500"
                                                            }`}
                                                    >
                                                        {new Date(message.createdAt).toLocaleTimeString(
                                                            "en-US",
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                    <div className="border-t p-4">
                                        <form onSubmit={handleSendMessage} className="flex gap-2">
                                            <Input
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type your message..."
                                                disabled={sending}
                                            />
                                            <Button type="submit" disabled={sending}>
                                                <Send className="w-4 h-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </>
                        ) : (
                            <CardContent className="py-12 text-center">
                                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Select a conversation to view</p>
                            </CardContent>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
}
