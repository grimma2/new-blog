import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Typography, Stack, Chip } from "@mui/material";
import Image from "next/image";

interface Tag {
  id: string;
  name: string;
}
interface NewsResponse {
  id: string;
  slug: string;
  title: string;
  cover_image: string | null;
  content: string;
  published_at: string;
  tags: Tag[];
}

export async function generateMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = (await params) as { slug: string };
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const res = await fetch(`${base}/api/news/?slug=${slug}`);
  const response = await res.json();
  const data = response.results || response;
  if (!data[0]) return {};
  return {
    title: data[0].title,
    description: data[0].content.slice(0, 160),
  };
}

export default async function NewsDetail({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const { slug } = (await params) as { slug: string };
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const res = await fetch(`${base}/api/news/?slug=${slug}`, { cache: "no-store" });
  const response = await res.json();
  const data = response.results || response;
  const news = data[0];
  if (!news) notFound();

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      {news.cover_image && (
        <img
          src={news.cover_image.startsWith("http") ? news.cover_image : `${base}${news.cover_image}`}
          alt={news.title}
          style={{ maxWidth: "100%", height: "auto" }}
        />
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