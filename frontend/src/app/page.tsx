"use client";

import { Box, Button } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Link href="/simple-rag-chat" style={{ textDecoration: 'none' }}>
        <Button variant="contained" size="large">
          Try Simple RAG Chat
        </Button>
      </Link>
    </Box>
  );
}