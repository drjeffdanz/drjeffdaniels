import { collection, config, fields } from "@keystatic/core";

export default config({
  storage: process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_MODE !== "true"
    ? { kind: "local" }
    : { kind: "github", repo: "drjeffdanz/drjeffdaniels" },
  ui: { brand: { name: "Dr. Jeff Daniels · Publishing" } },
  collections: {
    posts: collection({
      label: "Thought Leadership",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title", validation: { isRequired: true } } }),
        excerpt: fields.text({ label: "Short summary", multiline: true, validation: { isRequired: true } }),
        date: fields.date({ label: "Article date", validation: { isRequired: true }, description: "Display date only. To publish, set Status to Published and save to the production branch." }),
        status: fields.select({ label: "Status", options: [{ label: "Draft", value: "draft" }, { label: "Published", value: "published" }], defaultValue: "draft" }),
        topics: fields.array(fields.text({ label: "Topic" }), { label: "Topics", itemLabel: props => props.value }),
        content: fields.markdoc({ label: "Article", options: { image: { directory: "public/images/posts", publicPath: "/images/posts/" } } }),
      },
    }),
  },
});
