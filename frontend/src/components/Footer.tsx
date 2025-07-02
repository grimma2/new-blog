"use client";

import React from "react";
import { Box, Typography, Container } from "@mui/material";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e0e0e0",
        mt: "auto",
        py: 3,
        textAlign: "center",
      }}
    >
      <Container>
        <Typography variant="body2" color="text.secondary">
          © {currentYear}. Все права защищены.
        </Typography>
      </Container>
    </Box>
  );
} 