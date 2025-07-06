"use client";

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { buildMediaUrl, isVideo } from "@/lib/media";

interface Tag {
  id: string;
  name: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  cover_image: string | null;
  description: string;
  published_at: string;
  tags: Tag[];
}

export default function BigNewsCard({ news }: { news: NewsItem }) {
  const router = useRouter();
  const mediaUrl = buildMediaUrl(news.cover_image);
  const isVideoMedia = isVideo(mediaUrl);

  // Обрезаем заголовок до 150 символов
  const truncatedTitle = news.title.length > 150 
    ? news.title.substring(0, 147) + "..."
    : news.title;

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      mb: 2,
      minHeight: '280px'
    }}>
      <CardActionArea 
        onClick={() => router.push(`/news/${news.slug}`)}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {mediaUrl && (
          isVideoMedia ? (
            <CardMedia
              component="video"
              controls
              height="140"
              src={mediaUrl}
              sx={{ flexShrink: 0 }}
            />
          ) : (
            <CardMedia
              component="img"
              height="140"
              image={mediaUrl}
              alt={news.title}
              sx={{ flexShrink: 0 }}
            />
          )
        )}
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Typography 
            gutterBottom 
            variant="h5" 
            component="div"
            sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
              fontWeight: 'bold',
              lineHeight: 1.2,
              mb: 1
            }}
          >
            {truncatedTitle}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            paragraph
            sx={{ 
              flexGrow: 1,
              fontSize: '0.95rem',
              lineHeight: 1.4
            }}
          >
            {news.description}
          </Typography>
          <Box sx={{ mt: 'auto' }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
              {news.tags.map((t) => (
                <Chip 
                  key={t.id} 
                  label={t.name} 
                  size="small" 
                  color="primary"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              {new Date(news.published_at).toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
} 