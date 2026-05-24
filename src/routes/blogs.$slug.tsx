import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/blogs/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/vlogs/$slug",
      params: { slug: params.slug },
      replace: true,
    });
  },
});
