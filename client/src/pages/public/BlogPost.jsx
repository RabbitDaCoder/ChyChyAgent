import { useParams } from "react-router-dom";
import useBlog from "../../hooks/useBlog";
import Skeleton from "../../components/ui/Skeleton";

export default function BlogPost() {
  const { slug } = useParams();
  const { data: blog, loading } = useBlog(slug);

  if (loading || !blog) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <article className="prose prose-lg max-w-4xl py-10">
      <p className="text-label text-primary">{blog.category}</p>
      <h1 className="font-display text-display-xl text-text-primary">
        {blog.title}
      </h1>
      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full rounded-lg shadow-card"
        />
      )}
      <div
        className="prose text-text-muted"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Author byline */}
      <div className="mt-10 flex items-center gap-4 border-t border-border pt-6 not-prose">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
          ME
        </div>
        <div>
          <p className="font-semibold text-text-primary">Eloike Maryann</p>
          <p className="text-body-sm text-text-muted">
            Founder of ChyChyAgent. 15 years in real estate and insurance across
            Lagos.
          </p>
        </div>
      </div>
    </article>
  );
}
