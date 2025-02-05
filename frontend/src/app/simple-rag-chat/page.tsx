"use client";

import { useState, useRef, useEffect } from "react";
import { Paper, TextField, Button, Box, Avatar, List, ListItem, ListItemText } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";


export default function SimpleRagChat() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    // const [documents, setDocuments] = useState<{ id: string; fileName: string }[]>([]);

    // useEffect(() => {
    //     const fetchDocuments = async () => {
    //         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`);
    //         const data = await response.json();
    //         setDocuments(data);
    //     };
    //     fetchDocuments();
    // }, []);

    const handleSend = async () => {
        if (!input.trim() || isStreaming) return;

        // Add user message
        setMessages((prev) => [...prev, { role: "user", content: input }]);
        setInput(""); // Clear input

        setIsStreaming(true);
        let aiMessage = ""; // Accumulate AI response

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${apiUrl}/chat/stream`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: input,
                    chatHistory: messages.filter((m) => m.role === "user").map((m) => m.content),
                }),
            });

            if (!response.ok || !response.body) {
                throw new Error("Network error");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                aiMessage += decoder.decode(value, { stream: true });

                setMessages((prev) => {
                    const updatedMessages = [...prev];
                    if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].role === "assistant") {
                        updatedMessages[updatedMessages.length - 1].content = aiMessage;
                    } else {
                        updatedMessages.push({ role: "assistant", content: aiMessage });
                    }
                    return [...updatedMessages];
                });
            }
        } catch (error) {
            console.error("Error streaming:", error);
        } finally {
            setIsStreaming(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', }}>
            <Box sx={{ width: '300px', p: 2 }}>
                {/* 
                <Button variant="contained" color="primary">
                    Upload Document
                </Button>
                <List>
                    {documents?.map((document) => (
                        <ListItem key={document.id}>
                            <ListItemText primary={document.fileName} />
                        </ListItem>
                    ))}
                </List> */}
            </Box>

            <Box sx={{ flex: 1, p: 2 }}>
                <Box sx={{
                    height: '90vh',
                    maxWidth: '800px',
                    margin: '0 auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Paper elevation={3} sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: '#f5f5f5',
                        overflow: 'hidden'
                    }}>
                        {/* Chat Display */}
                        <Box

                            sx={{

                                flex: 1,
                                overflowY: 'auto',
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}>
                            {messages.map((m, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                                        gap: 1,
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    {m.role === "assistant" && (
                                        <Avatar sx={{ bgcolor: 'grey.400', width: 32, height: 32 }} />
                                    )}
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            maxWidth: '80%',
                                            p: 1.5,
                                            bgcolor: m.role === "user" ? 'primary.main' : 'grey.200',
                                            color: m.role === "user" ? 'white' : 'text.primary',
                                            borderRadius: 3
                                        }}
                                    >
                                        {m.content}
                                    </Paper>
                                    {m.role === "user" && (
                                        <Avatar sx={{ bgcolor: 'grey.400', width: 32, height: 32 }} />
                                    )}
                                </Box>
                            ))}
                        </Box>

                        {/* Input & Send Button */}
                        <Box sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    disabled={isStreaming}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '24px',
                                            bgcolor: 'grey.100'
                                        }
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleSend}
                                    disabled={isStreaming}
                                    sx={{
                                        borderRadius: '24px',
                                        px: 3,
                                        minWidth: '120px'
                                    }}
                                    endIcon={<SendIcon />}
                                >
                                    {isStreaming ? "Streaming..." : "Send"}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
} 