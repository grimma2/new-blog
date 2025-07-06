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

export default function NewsCard({ news }: { news: NewsItem }) {
  const router = useRouter();
  const mediaUrl = buildMediaUrl(news.cover_image);
  const isVideoMedia = isVideo(mediaUrl);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea 
        onClick={() => router.push(`/news/${news.slug}`)}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {mediaUrl && (
          isVideoMedia ? (
            <CardMedia
              component="video"
              controls
              height="180"
              src={mediaUrl}
              sx={{ flexShrink: 0 }}
            />
          ) : (
            <CardMedia
              component="img"
              height="180"
              image={mediaUrl}
              alt={news.title}
              sx={{ flexShrink: 0 }}
            />
          )
        )}
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography gutterBottom variant="h6" component="div">
            {news.title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            paragraph
            sx={{ flexGrow: 1 }}
          >
            {news.description}
          </Typography>
          <Box sx={{ mt: 'auto' }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
              {news.tags.map((t) => (
                <Chip key={t.id} label={t.name} size="small" color="primary" />
              ))}
            </Stack>
            <Typography variant="caption" color="text.secondary">
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