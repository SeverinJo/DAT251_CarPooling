import { useState, useRef, useEffect } from "react"
import { Avatar, Box, Container, IconButton, Paper, Stack, TextField, Typography } from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import { currentUser } from "../api/mock"
import type { User } from "../types"

interface Message {
    id: number
    senderId: string
    text: string
    timestamp: string
}

const otherUser: User = {
    id: "u2",
    name: "Luka",
    email: "luka@example.com",
    rating: 3.0,
}

const initialMessages: Message[] = [
    { id: 1, senderId: "u2", text: "Hey! Ready for the trip to Oslo?", timestamp: "10:00" },
    { id: 2, senderId: "u1", text: "Yeah, picking you up at Voss at 10!", timestamp: "10:01" },
]

function ChatPage() {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [input, setInput] = useState("")
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    function sendMessage() {
        const text = input.trim()
        if (!text) return
        const now = new Date()
        const timestamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        setMessages((prev) => [...prev, { id: Date.now(), senderId: currentUser.id, text, timestamp }])
        setInput("")
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: "calc(100vh - 64px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Paper elevation={3} sx={{ p: 0, width: "100%", borderRadius: 3, overflow: "hidden" }}>
                    {/* Header */}
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ px: 3, py: 2, borderBottom: 1, borderColor: "divider" }}
                    >
                        <Avatar sx={{ width: 40, height: 40 }}>
                            {otherUser.name[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {otherUser.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Rating: {otherUser.rating}
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Messages */}
                    <Box
                        sx={{
                            height: 400,
                            overflowY: "auto",
                            px: 3,
                            py: 2,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                        }}
                    >
                        {messages.map((msg) => {
                            const isMe = msg.senderId === currentUser.id
                            return (
                                <Stack
                                    key={msg.id}
                                    direction={isMe ? "row-reverse" : "row"}
                                    spacing={1}
                                    alignItems="flex-end"
                                >
                                    <Avatar
                                        src={isMe ? currentUser.avatar : undefined}
                                        sx={{ width: 32, height: 32, fontSize: 14 }}
                                    >
                                        {!isMe ? otherUser.name[0] : undefined}
                                    </Avatar>
                                    <Box
                                        sx={{
                                            maxWidth: "70%",
                                            bgcolor: isMe ? "primary.main" : "grey.100",
                                            color: isMe ? "primary.contrastText" : "text.primary",
                                            borderRadius: 2,
                                            px: 2,
                                            py: 1,
                                        }}
                                    >
                                        <Typography variant="body2">{msg.text}</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{ opacity: 0.7, display: "block", textAlign: "right", mt: 0.25 }}
                                        >
                                            {msg.timestamp}
                                        </Typography>
                                    </Box>
                                </Stack>
                            )
                        })}
                        <div ref={bottomRef} />
                    </Box>

                    {/* Input */}
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ px: 3, py: 2, borderTop: 1, borderColor: "divider" }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <IconButton color="primary" onClick={sendMessage} disabled={!input.trim()}>
                            <SendIcon />
                        </IconButton>
                    </Stack>
                </Paper>
            </Box>
        </Container>
    )
}

export default ChatPage