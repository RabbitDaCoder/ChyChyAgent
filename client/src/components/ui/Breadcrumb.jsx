import PropTypes from "prop-types";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ crumbs }) {
  return (
    <nav aria-label="Breadcrumb" className="text-label text-text-muted">
      <ol itemScope itemType="https://schema.org/BreadcrumbList" className="flex flex-wrap items-center gap-1">
        {crumbs.map((crumb, i) => (
          <li
            key={i}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="flex items-center gap-1"
          >
            <a href={crumb.href} itemProp="item" className="hover:text-primary">
              <span itemProp="name">{crumb.label}</span>
            </a>
            <meta itemProp="position" content={i + 1} />
            {i < crumbs.length - 1 && <ChevronRight size={14} className="text-text-light" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

Breadcrumb.propTypes = {
  crumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })
  ).isRequired,
};
