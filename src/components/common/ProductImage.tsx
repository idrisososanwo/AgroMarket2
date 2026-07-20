import { useState } from "react";
import { Leaf } from "lucide-react";

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

/**
 * Reusable Product Image component that supports Unsplash URLs,
 * local image paths, emoji fallback, and error handling.
 */
export default function ProductImage({
  src,
  alt,
  className = "h-full w-full object-cover",
  containerClassName = "",
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  const isUrl = src && (src.startsWith("http") || src.startsWith("/"));

  if (!isUrl || hasError) {
    // If src is an emoji or failed to load
    return (
      <div className={`flex items-center justify-center bg-emerald-50/60 text-emerald-700 ${containerClassName || className}`}>
        {src && src.length <= 4 && !hasError ? (
          <span className="text-5xl select-none">{src}</span>
        ) : (
          <Leaf className="h-10 w-10 text-emerald-500/80" />
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      loading="lazy"
      className={className}
    />
  );
}
