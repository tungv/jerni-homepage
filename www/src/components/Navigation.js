import Link from "next/link";
export default function Navigation() {
  return (
    <nav>
      <ol>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/blog">
            <a>Blog</a>
          </Link>
        </li>
      </ol>
    </nav>
  );
}
