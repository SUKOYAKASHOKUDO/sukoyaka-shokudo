import Image from "next/image";
import Link from "next/link";

type SukoyakaBrandHomeLinkProps = {
  className?: string;
  priority?: boolean;
};

export function SukoyakaBrandHomeLink({
  className = "",
  priority = false,
}: SukoyakaBrandHomeLinkProps) {
  return (
    <Link
      className={`sukoyaka-brand-home-link ${className}`.trim()}
      href="/"
      aria-label="子ども食堂 すこやか食堂 トップへ"
    >
      <Image
        className="sukoyaka-brand-single-logo"
        src="/images/brand/sukoyaka-header-logo-transparent.webp"
        alt=""
        width={482}
        height={112}
        priority={priority}
        draggable={false}
      />
    </Link>
  );
}
