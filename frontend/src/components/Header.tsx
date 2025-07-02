"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMediaQuery, useTheme } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TagTabs from "./TagTabs";
import SearchBar from "./SearchBar";

interface Tag {
  id: string;
  name: string;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const currentTag = params.get("tag") ?? "all";

  const { data } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await axios.get(`${base}/api/tags/`);
      return res.data.results ?? res.data;
    },
  });

  const handleTagClick = (value: string) => {
    const newUrl = value === "all" ? "/" : `/?tag=${value}`;
    router.push(newUrl);
    setOpen(false);
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Новости
          </Typography>
          {!isMobile && <SearchBar />}
          {/* На десктопе показываем вкладки сразу под AppBar */}
        </Toolbar>
        {!isMobile && <TagTabs />}
      </AppBar>

      {/* Drawer для мобильных */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 250 }}>
          <ListItemButton
            selected={currentTag === "all"}
            onClick={() => handleTagClick("all")}
          >
            <ListItemText primary="Все" />
          </ListItemButton>
          {data?.map((t) => (
            <ListItemButton
              key={t.id}
              selected={currentTag === t.id}
              onClick={() => handleTagClick(t.id)}
            >
              <ListItemText primary={t.name} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
} 