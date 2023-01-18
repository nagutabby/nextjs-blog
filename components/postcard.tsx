import Link from 'next/link';
import Image from 'next/image';

type Props = {
  post: {
    slug: string
    frontMatter: {
      image: string
      title: string
      date: string
    }

  }
}
const PostCard = ({ post }: Props) => {
  return (
    <Link href={`/posts/${post.slug}`}>
      <div className="border rounded-lg">
        <Image
          loader={cloudflareLoader}
          src={`/${post.frontMatter.image}`}
          width={1200}
          height={700}
          alt={post.frontMatter.title}
        />
      </div>
      <div className="px-2 py-4">
        <h1 className="font-bold text-lg">{post.frontMatter.title}</h1>
        <span>{post.frontMatter.date}</span>
      </div>
    </Link>
  );
};

const normalizeSrc = src => {
  return src.startsWith('/') ? src.slice(1) : src;
};
const cloudflareLoader = ({ src, width, quality }) => {
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  const paramsString = params.join(',');
  return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
};

export default PostCard;
