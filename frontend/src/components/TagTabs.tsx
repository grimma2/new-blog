"use client";

import { Tabs, Tab } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { SyntheticEvent } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

interface Tag {
  id: string;
  name: string;
}

export default function TagTabs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const router = useRouter();
  const params = useSearchParams();
  const tag = params.get("tag") ?? "all";

  const { data } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await axios.get(`${base}/api/tags/`);
      return res.data.results ?? res.data;
    },
  });

  const handleChange = (_: SyntheticEvent, value: string) => {
    const newUrl = value === "all" ? "/" : `/?tag=${value}`;
    router.push(newUrl);
  };

  if (isMobile) return null;

  return (
    <Tabs
      value={tag}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="Фильтр по тегам"
      textColor="primary"
      indicatorColor="primary"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        "& .MuiTab-root": {
          color: "rgba(255, 255, 255, 0.8)",
          "&.Mui-selected": {
            color: "#ffffff"
          }
        }
      }}
    >
      <Tab label="Все" value="all" />
      {data?.map((t) => (
        <Tab key={t.id} label={t.name} value={t.id} />
      ))}
    </Tabs>
  );
} 