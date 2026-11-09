import { Collection } from "@/components/portfolio";
import {
  ReferenceService,
  ReferenceStories,
} from "@/components/reference-pages";
import { notFound } from "next/navigation";
export function generateStaticParams() {
  return ["weddings", "commercial", "works", "stories"].map((section) => ({
    section,
  }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (section === "weddings") return <ReferenceService type="Weddings" />;
  if (section === "commercial") return <ReferenceService type="Commercial" />;
  if (section === "works") return <Collection />;
  if (section === "stories") return <ReferenceStories />;
  notFound();
}
