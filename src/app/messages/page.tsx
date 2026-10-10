"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  Loader2,
  Sparkles,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
} from "@/lib/services/marketplace";
import type { Conversation, Message } from "@/types";

function MessagesContent() {
  const { user, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const targetCreatorId = searchParams.get("creatorId");
  const targetCreatorName = searchParams.get("creatorName");
  const targetCreatorHandle = searchParams.get("creatorHandle");
  const targetCreatorAvatar = searchParams.get("creatorAvatar");
  const initialPostTitle = searchParams.get("postTitle");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputContent, setInputContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations and handle ?creatorId target
  useEffect(() => {
    async function load() {
      if (authLoading) return;
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      let convs = await getConversations(user.id);

      // If user came via "Message Creator" with targetCreatorId
      if (targetCreatorId) {
        const targetConv = await getOrCreateConversation(user.id, targetCreatorId, {
          display_name: targetCreatorName || undefined,
          handle: targetCreatorHandle || undefined,
          avatar_url: targetCreatorAvatar || undefined,
        });

        // Pre-fill prompt if postTitle passed and input is empty
        if (initialPostTitle && !inputContent) {
          setInputContent(
            `Hi! I'm interested in commissioning commercial work based on "${initialPostTitle}". Could you share your turnaround time and deliverables?`
          );
        }

        // Ensure target is in convs list
        if (!convs.some((c) => c.id === targetConv.id)) {
          convs = [targetConv, ...convs];
        } else {
          convs = convs.map((c) => (c.id === targetConv.id ? targetConv : c));
        }
        setActiveConversation(targetConv);
      } else if (convs.length > 0) {
        setActiveConversation((prev) => (prev && convs.some((c) => c.id === prev.id) ? prev : convs[0]));
      } else {
        setActiveConversation(null);
      }

      setConversations(convs);
      setIsLoading(false);
    }
    load();
  }, [
    user?.id,
    authLoading,
    targetCreatorId,
    targetCreatorName,
    targetCreatorHandle,
    targetCreatorAvatar,
    initialPostTitle,
  ]);

  // Load messages whenever activeConversation changes
  useEffect(() => {
    async function loadThread() {
      if (!activeConversation) {
        setMessages([]);
        return;
      }
      const msgs = await getMessages(activeConversation.id);
      setMessages(msgs);
    }
    loadThread();
  }, [activeConversation]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSelectConversation(conv: Conversation) {
    if (activeConversation?.id === conv.id) return;
    setMessages([]); // Immediately clear stale conversation messages
    setActiveConversation(conv);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!inputContent.trim() || !activeConversation || !user || isSending) return;

    setIsSending(true);
    const content = inputContent.trim();
    setInputContent("");

    const newMsg = await sendMessage(activeConversation.id, user.id, content);
    setMessages((prev) => [...prev, newMsg]);

    // Update conversation snippet in list
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? { ...c, last_message: content, last_message_at: new Date().toISOString() }
          : c
      )
    );

    setIsSending(false);
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#9d7bf5] animate-pulse" />
          <p className="text-xs font-mono text-[#9b92b6]">Connecting secure channel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-2xl border border-[#271f43] bg-[#140f26] p-8 text-center shadow-xl">
          <MessageSquare className="w-10 h-10 text-[#7e749e] mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Sign In Required</h2>
          <p className="text-xs text-[#9b92b6] mt-2 leading-relaxed">
            Please sign in to message creators, discuss project deliverables, and manage your conversations.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link
              href="/login?redirect=/messages"
              className="px-5 py-2 rounded-full bg-[#9d7bf5] text-[#0b0914] text-xs font-bold"
            >
              Sign In
            </Link>
            <Link
              href="/marketplace"
              className="px-5 py-2 rounded-full bg-[#1e163b] text-[#c4b5fd] text-xs font-medium border border-[#3b2d66]"
            >
              Browse Works
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="max-w-7xl mx-auto w-full p-6 flex-1 flex flex-col">
        {/* Title Bar */}
        <div className="pb-4 mb-4 border-b border-[#1d1633] flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#9d7bf5]" />
              Direct Messages
            </h1>
            <p className="text-xs text-[#9b92b6] mt-0.5">
              Discuss project requirements, turnaround times, and delivery formats directly with verified creators.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="text-xs text-[#9d7bf5] hover:text-[#b094fa] font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Marketplace
          </Link>
        </div>

        {/* Messaging Layout: Sidebar (Conversations) + Main Thread */}
        <div className="flex-1 rounded-3xl border border-[#261e40] bg-[#140f26] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px] shadow-2xl">
          {/* Conversation List Sidebar (4 cols) */}
          <div className="md:col-span-4 border-r border-[#201838] bg-[#0f0b1d] flex flex-col">
            <div className="p-4 border-b border-[#201838] flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7e749e] font-semibold">
                CONVERSATIONS ({conversations.length})
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#1a142e]">
              {conversations.length > 0 ? (
                conversations.map((conv) => {
                  const isActive = activeConversation?.id === conv.id;
                  const party = conv.other_party;

                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => handleSelectConversation(conv)}
                      className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                        isActive
                          ? "bg-[#21183c] border-l-2 border-[#9d7bf5]"
                          : "hover:bg-[#16102a]"
                      }`}
                    >
                      {party?.avatar_url ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-[#392c61] shrink-0 relative">
                          <Image
                            src={party.avatar_url}
                            alt={party.display_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#271f43] text-[#c4b5fd] font-bold text-sm flex items-center justify-center shrink-0">
                          {party?.display_name?.charAt(0) || "C"}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h4 className="font-bold text-xs text-white truncate">
                            {party?.display_name || "Creator"}
                          </h4>
                          <span className="text-[10px] font-mono text-[#6e658f] shrink-0">
                            {new Date(conv.last_message_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-[#8c82ab] line-clamp-1">
                          {conv.last_message || "Active conversation"}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-[#7e749e]">
                  No active conversations yet.
                </div>
              )}
            </div>
          </div>

          {/* Active Chat Thread (8 cols) */}
          <div className="md:col-span-8 flex flex-col bg-[#140f26]">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 px-6 border-b border-[#201838] bg-[#120d24] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {activeConversation.other_party?.avatar_url ? (
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-[#3b2d66] relative shrink-0">
                        <Image
                          src={activeConversation.other_party.avatar_url}
                          alt={activeConversation.other_party.display_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#9d7bf5] text-[#0b0914] font-bold text-xs flex items-center justify-center font-mono shrink-0">
                        {activeConversation.other_party?.display_name?.charAt(0) || "C"}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                        {activeConversation.other_party?.display_name || "Creator"}
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Verified
                        </span>
                      </h3>
                      <p className="text-[10px] text-[#8c82ab] font-mono">
                        @{activeConversation.other_party?.handle || "creator"} •{" "}
                        {activeConversation.other_party?.role === "client" ? "Client Partner" : "Creative Director"}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={
                      activeConversation.other_party?.role === "client"
                        ? "/profile/client"
                        : `/creators/${activeConversation.other_party?.id || ""}`
                    }
                    className="text-xs text-[#c4b5fd] hover:text-white font-medium"
                  >
                    View Profile →
                  </Link>
                </div>

                {/* Work Context Banner if postTitle was referenced */}
                {initialPostTitle && (
                  <div className="px-6 py-2.5 bg-[#1b1338]/60 border-b border-[#291f4d] flex items-center gap-2 text-xs text-[#c4b5fd]">
                    <Briefcase className="w-3.5 h-3.5 text-[#9d7bf5] shrink-0" />
                    <span className="truncate">
                      Context: Commission inquiry for <strong className="text-white">"{initialPostTitle}"</strong>
                    </span>
                  </div>
                )}

                {/* Messages Bubbles Area */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-[380px]">
                  {messages.length > 0 ? (
                    messages.map((msg) => {
                      const isMe = msg.sender_id === user?.id;

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`max-w-[78%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                              isMe
                                ? "bg-[#9d7bf5] text-[#0b0914] font-medium rounded-tr-none shadow-md shadow-[#9d7bf5]/15"
                                : "bg-[#1f1738] text-white rounded-tl-none border border-[#34275c]"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <span className="text-[10px] font-mono text-[#6e658f] mt-1 px-1">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-[#7e749e] py-12">
                      <Sparkles className="w-8 h-8 text-[#9d7bf5] mb-2" />
                      <p className="text-sm font-semibold text-white">Direct Project Conversation</p>
                      <p className="text-xs text-[#8c82ab] mt-1 max-w-sm">
                        Send a message below to discuss deliverables, commercial terms, or request a custom quote.
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Footer */}
                <form
                  onSubmit={handleSend}
                  className="p-4 border-t border-[#201838] bg-[#0f0b1d] flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    placeholder="Type your message or project inquiry..."
                    className="flex-1 px-4 py-3 rounded-2xl bg-[#140f26] border border-[#271f43] text-sm text-white placeholder-[#7e749e] focus:outline-none focus:border-[#9d7bf5] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputContent.trim() || isSending}
                    className="p-3 rounded-2xl bg-[#9d7bf5] hover:bg-[#b094fa] disabled:opacity-50 text-[#0b0914] font-bold transition-all shadow-md shrink-0 flex items-center justify-center"
                    title="Send message"
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* No Conversation Selected */
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#7e749e]">
                <MessageSquare className="w-12 h-12 text-[#3b2d66] mb-3" />
                <h3 className="text-base font-bold text-white">No Conversation Selected</h3>
                <p className="text-xs text-[#8c82ab] mt-1 max-w-xs">
                  Choose a conversation from the sidebar or click "Message" on any marketplace creator work.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b0914] flex items-center justify-center text-white text-xs font-mono">
          Loading direct messages...
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
