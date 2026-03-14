import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { formattedDate } from "../../utils/dateFormatter";
import { truncateText } from "../../hooks/truncateText";

export default function BlogCard({
  title,
  category,
  excerpt,
  coverImage,
  slug = "#",
  readTime,
  createdAt,
}) {
  return (
    <Card hover className="overflow-hidden">
      <img
        src={
          coverImage ||
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80"
        }
        alt={title}
        className="h-44 w-full object-cover"
      />
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <Badge>{category || "Real Estate"}</Badge>
          {readTime && (
            <span className="text-label text-text-muted">
              {readTime} min read
            </span>
          )}
        </div>
        <h3 className="font-display text-xl text-text-primary leading-tight">
          {title}
        </h3>
        <p className="text-text-muted text-body-sm">
          {truncateText(excerpt || "", 110)}
        </p>
        <div className="flex items-center justify-between text-label text-text-light">
          <span>{formattedDate(createdAt || new Date())}</span>
          <Link to={`/blog/${slug}`} className="text-primary hover:underline">
            Read more →
          </Link>
        </div>
      </div>
    </Card>
  );
}

BlogCard.propTypes = {
  title: PropTypes.string,
  category: PropTypes.string,
  excerpt: PropTypes.string,
  coverImage: PropTypes.string,
  slug: PropTypes.string,
  readTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  createdAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
};
