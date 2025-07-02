"use client";

import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("search") || "");

  const handleSearch = () => {
    const url = new URL(window.location.toString());
    if (query.trim()) {
      url.searchParams.set("search", query.trim());
    } else {
      url.searchParams.delete("search");
    }
    url.searchParams.delete("page"); // reset to page 1
    router.push(url.pathname + url.search);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <TextField
      size="small"
      placeholder="Поиск новостей..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyPress={handleKeyPress}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleSearch} edge="end" sx={{ color: "#d32f2f" }}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ 
        minWidth: 250,
        "& .MuiOutlinedInput-root": {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          "& input": {
            color: "#212121"
          },
          "& input::placeholder": {
            color: "#757575",
            opacity: 1
          }
        }
      }}
    />
  );
} 