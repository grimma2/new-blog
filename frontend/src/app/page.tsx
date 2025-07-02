"use client";

import React from "react";
import { Container, Grid, Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import BigNewsCard from "@/components/BigNewsCard";
import CategoryNewsBlock from "@/components/CategoryNewsBlock";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  cover_image: string | null;
  description: string;
  published_at: string;
  tags: Tag[];
}

interface CategoryData {
  tag: Tag;
  news: NewsItem[];
}

export default function Home() {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Запрос последних новостей из API
  const { data: latestApiNews } = useQuery<NewsItem[]>({
    queryKey: ["homepage", "latest-api-news"],
    queryFn: async () => {
      const res = await axios.get(`${base}/api/homepage/latest_api_news/`);
      return res.data;
    },
  });

  // Запрос топ категорий с новостями
  const { data: topCategories } = useQuery<CategoryData[]>({
    queryKey: ["homepage", "top-categories"],
    queryFn: async () => {
      const res = await axios.get(`${base}/api/homepage/top_categories/`);
      return res.data;
    },
  });

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* Левая колонка - большие карточки новостей из API */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
              Последние новости
            </Typography>
            
            {latestApiNews && latestApiNews.length > 0 ? (
              <Box sx={{ width: '100%', maxWidth: '700px' }}>
                {latestApiNews.map((news) => (
                  <BigNewsCard key={news.id} news={news} />
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Пока нет новостей из API
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Правая колонка - категории с новостями */}
        <Grid item xs={12} lg={4}>
          {topCategories && topCategories.length > 0 ? (
            <CategoryNewsBlock categories={topCategories} />
          ) : (
            <Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Рубрики
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Пока нет рубрик с новостями
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
