"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";

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

interface CategoryNewsBlockProps {
  categories: CategoryData[];
}

function SmallNewsCard({ news }: { news: NewsItem }) {
  const router = useRouter();
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const imageUrl = news.cover_image
    ? news.cover_image.startsWith("http")
      ? news.cover_image
      : `${base}${news.cover_image}`
    : null;

  return (
    <Card sx={{ mb: 1, display: 'flex', flexDirection: 'column' }}>
      <CardActionArea 
        onClick={() => router.push(`/news/${news.slug}`)}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {imageUrl && (
          <CardMedia
            component="img"
            sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
            image={imageUrl}
            alt={news.title}
          />
        )}
        <CardContent sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: 1,
          '&:last-child': { pb: 1 }
        }}>
          <Typography 
            variant="subtitle2" 
            component="div"
            sx={{ 
              fontWeight: 'bold',
              fontSize: '0.85rem',
              lineHeight: 1.2,
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {news.title}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              flexGrow: 1,
              fontSize: '0.75rem',
              mb: 0.5
            }}
          >
            {news.description}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            {new Date(news.published_at).toLocaleDateString("ru-RU", {
              day: "2-digit",
              month: "short",
            })}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function CategoryNewsBlock({ categories }: CategoryNewsBlockProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Рубрики
      </Typography>
      
      <Box>
        {categories.map((category) => (
          <Box key={category.tag.id} sx={{ mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1.5,
              pb: 0.5,
              borderBottom: '2px solid',
              borderColor: 'primary.main'
            }}>
              <Chip 
                label={category.tag.name} 
                color="primary" 
                variant="filled"
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  height: '32px'
                }}
              />
            </Box>
            
            {/* Показываем только последнюю новость */}
            {category.news.length > 0 && (
              <SmallNewsCard news={category.news[0]} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
} 