import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Typography, Stack, Chip } from "@mui/material";
import Image from "next/image";
import { buildMediaUrl, isVideo } from "@/lib/media";

interface Tag {
  id: string;
  name: string;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  console.log(process.env.NEXT_PUBLIC_API_URL);
  const base = process.env.NEXT_PUBLIC_API_URL || "https://linfo.tg";
  const res = await fetch(`${base}/api/news/?slug=${slug}`);
  const response = await res.json();
  const data = response.results || response;
  if (!data[0]) return {};
  return {
    title: data[0].title,
    description: data[0].content.slice(0, 160),
  };
}

export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log(process.env.NEXT_PUBLIC_API_URL);
  const base = process.env.NEXT_PUBLIC_API_URL || "https://linfo.tg";
  const res = await fetch(`${base}/api/news/?slug=${slug}`, { cache: "no-store" });
  const response = await res.json();
  const data = response.results || response;
  const news = data[0];
  if (!news) notFound();

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
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {news.tags.map((t: Tag) => (
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

export const dynamic = "force-dynamic";
export const revalidate = 60; 