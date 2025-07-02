"use client";

import Container from "@mui/material/Container";
import { Typography, Box } from "@mui/material";
import NewsList from "@/components/NewsList";

export default function AllNewsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Все новости
        </Typography>
      </Box>
      <NewsList />
    </Container>
  );
} 