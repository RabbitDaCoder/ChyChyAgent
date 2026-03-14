import useBlogs from "../../hooks/useBlogs";
import BlogCard from "../../components/shared/BlogCard";
import Skeleton from "../../components/ui/Skeleton";

export default function Blog() {
  const { data: blogs, loading } = useBlogs({ status: "published", limit: 9 });

  return (
    <section className="py-10 space-y-6">
      <div className="space-y-2">
        <p className="text-label text-primary uppercase tracking-wide">Blog</p>
        <h1 className="font-display text-display-lg text-text-primary">
          Insights & Advice
        </h1>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-64 w-full" />
          ))}
        {!loading &&
          blogs?.map((blog) => (
            <BlogCard
              key={blog._id}
              title={blog.title}
              category={blog.category}
              excerpt={blog.excerpt}
              coverImage={blog.coverImage}
              slug={blog.slug}
              readTime={blog.readTime}
              createdAt={blog.createdAt}
            />
          ))}
      </div>
    </section>
  );
}
