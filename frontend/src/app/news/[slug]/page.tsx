"use client";

import { Container, Typography, Stack, Chip } from "@mui/material";
import Image from "next/image";
import { buildMediaUrl, isVideo } from "@/lib/media";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Tag {
  id: string;
  name: string;
}

interface NewsItem {
  id: string;
  title: string;
  cover_image: string | null;
  description: string;
  content: string;
  published_at: string;
  tags: Tag[];
}

export default function NewsDetail() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : params.slug?.[0] || "";

  const base = process.env.NEXT_PUBLIC_API_URL || "https://linfo.tg";

  const safeSlug = encodeURIComponent(decodeURIComponent(slug));

  const { data: news, isLoading, error } = useQuery<NewsItem | undefined>({
    queryKey: ["news", slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await axios.get(`${base}/api/news/?slug=${safeSlug}`);
      const data = res.data.results || res.data;
      return data[0] as NewsItem | undefined;
    },
  });

  if (isLoading) return <Typography sx={{ mt: 4 }}>Загрузка...</Typography>;
  if (error || !news) return <Typography sx={{ mt: 4 }}>Новость не найдена.</Typography>;

  const mediaUrl = buildMediaUrl(news.cover_image);
  const isVideoMedia = isVideo(mediaUrl);

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      {mediaUrl && (
        isVideoMedia ? (
          <video
            src={mediaUrl}
            controls
            style={{ width: "100%", maxHeight: 400 }}
          />
        ) : (
          <Image
            src={mediaUrl}
            alt={news.title}
            width={800}
            height={400}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )
      )}
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
        {news.title}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {new Date(news.published_at).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {news.tags.map((t) => (
          <Chip key={t.id} label={t.name} size="small" />
        ))}
      </Stack>
      {/* TODO: markdown render */}
      <Typography variant="body1" component="article" sx={{ whiteSpace: "pre-wrap" }}>
        {news.content}
      </Typography>
    </Container>
  );
} 