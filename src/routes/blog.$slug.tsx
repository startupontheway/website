import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/blogs/$slug",
      params: { slug: params.slug },
      replace: true,
    });
  },
});
