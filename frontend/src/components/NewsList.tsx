"use client";

import React, { Suspense } from "react";
import { Grid, Pagination, Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import NewsCard, { NewsItem } from "./NewsCard";
import { useSearchParams, useRouter } from "next/navigation";

function NewsListContent() {
  const params = useSearchParams();
  const tagId = params.get("tag");
  const searchQuery = params.get("search");
  const pageParam = params.get("page") ?? "1";
  const page = parseInt(pageParam);

  const router = useRouter();

  interface NewsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: NewsItem[];
  }

  const { data } = useQuery<NewsResponse>({
    queryKey: ["news", tagId ?? "all", searchQuery ?? "", page],
    queryFn: async () => {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const url = new URL(`${base}/api/news/`);
      if (tagId && tagId !== "all") {
        url.searchParams.append("tags", tagId);
      }
      if (searchQuery) {
        url.searchParams.append("search", searchQuery);
      }
      url.searchParams.append("page", String(page));
      const res = await axios.get(url.toString());
      return res.data;
    },
  });

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    const url = new URL(window.location.toString());
    url.searchParams.set("page", String(value));
    router.push(url.pathname + url.search);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {data?.results.map((n) => (
          <Grid key={n.id} item xs={12} sm={6} md={4} lg={3}>
            <NewsCard news={n} />
          </Grid>
        ))}
      </Grid>
      {data && data.count > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            page={page}
            count={Math.ceil(data.count / data.results.length)}
            color="primary"
            onChange={handlePageChange}
          />
        </Box>
      )}
    </Box>
  );
}

export default function NewsList() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    }>
      <NewsListContent />
    </Suspense>
  );
} 