"use client";

import { useEffect, useRef, useState } from "react";
import { ChatIcon, CloseIcon, SendIcon } from "@/components/icons";

type Message = { id: number; from: "agent" | "visitor"; text: string };

const AGENT = "Welcome";

const GREETING =
  "Hello, and welcome to Kindred of Ireland. Ask us anything about sizing, fabrics, delivery or an order.";

const QUICK_REPLIES: { label: string; href: string }[] = [
  { label: "Shipping", href: "/policies/shipping-policy" },
  { label: "Returns & Refunds", href: "/pages/returns-and-refunds" },
  { label: "Contact", href: "/pages/contact" },
];

/**
 * Stands in for the Gorgias Live Chat widget the storefront loads.
 *
 * The real widget is a hosted third-party app: its appearance lives in Gorgias's
 * dashboard and it posts into the shop's actual support inbox using their app
 * key. Loading it here would need a live connection and would file real tickets
 * against a real business, so this is a self-contained replacement that matches
 * the placement and shape of the original and never calls out.
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: "agent", text: GREETING },
  ]);
  const [draft, setDraft] = useState("");
  const [unread, setUnread] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(false);
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function send(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setMessages((current) => [
      ...current,
      { id: current.length, from: "visitor", text },
      {
        id: current.length + 1,
        from: "agent",
        text: "Thanks for your message. This rebuild is not connected to live support, so nobody will read it — please use the contact page to reach the team.",
      },
    ]);
    setDraft("");
  }

  return (
    <div className={`chat-widget${open ? " chat-widget--open" : ""}`}>
      <div
        className="chat-panel"
        role="dialog"
        aria-label={`Chat with ${AGENT}`}
        aria-hidden={!open}
      >
        <div className="chat-panel__header">
          <div>
            <div className="chat-panel__title h6">{AGENT}</div>
            <div className="chat-panel__status very-small-text">Usually replies within a day</div>
          </div>
          <button
            type="button"
            className="chat-panel__close"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="chat-panel__log" ref={logRef}>
          {messages.map((message) => (
            <div className={`chat-message chat-message--${message.from}`} key={message.id}>
              <p className="medium-text">{message.text}</p>
            </div>
          ))}
        </div>

        <div className="chat-panel__quick">
          {QUICK_REPLIES.map((reply) => (
            <a href={reply.href} className="chat-quick very-small-text" key={reply.href}>
              {reply.label}
            </a>
          ))}
        </div>

        <form className="chat-panel__form" onSubmit={send}>
          <input
            ref={inputRef}
            type="text"
            className="chat-panel__input"
            placeholder="Write a message"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Message"
          />
          <button
            type="submit"
            className="chat-panel__send"
            disabled={!draft.trim()}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </form>
      </div>

      <button
        type="button"
        className="chat-launcher"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
        {!open && unread && <span className="chat-launcher__dot" aria-hidden="true" />}
      </button>
    </div>
  );
}
