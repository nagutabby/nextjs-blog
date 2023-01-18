import fs from 'fs';
import matter from 'gray-matter';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { createElement, ReactNode } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import rehypeStringify from 'rehype-stringify';
import rehypePrism from '@mapbox/rehype-prism';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import { toc } from 'mdast-util-toc';
import { cloudflareLoader } from '@/utils/cloudflareLoader';

type Props = {
  params: {
    slug: string
  }
  toc: string
  content: string
  slug: string
  frontMatter: {
    categories: string[]
    description: string
    image: string
    title: string
    date: string
  }
  href: string
  children: ReactNode
  src: string
  alt: string
}


const getToc = (options: any) => {
  return (node: any) => {
    const result = toc(node, options);
    node.children = [result.map];
  };
};

export async function getStaticProps({ params }: Props) {
  const file = fs.readFileSync(`posts/${params.slug}.md`, 'utf-8');
  const { data, content } = matter(file);
  const result = await unified()
    .use(remarkParse)
    .use(remarkToc, { heading: '目次' })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypePrism)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);
  const toc = await unified()
    .use(remarkParse)
    .use(getToc, {
      heading: '目次',
      tight: true,
    })
    // @ts-ignore
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content);

  return { props: { frontMatter: data, content: result.toString(), slug: params.slug, toc: toc.toString() } };
}

export async function getStaticPaths() {
  const files = fs.readdirSync('posts');
  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace(/\.md$/, ''),
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

const Post = ({ frontMatter, content, slug, toc }: Props) => {
  return (
    <>
      <NextSeo
        title={frontMatter.title}
        description={frontMatter.description}
        openGraph={{
          type: 'website',
          url: `http:localhost:3000/posts/${slug}`,
          title: frontMatter.title,
          description: frontMatter.description,
          images: [
            {
              url: `https://localhost:3000/${frontMatter.image}`,
              width: 1200,
              height: 700,
              alt: frontMatter.title,
            },
          ],
        }}
      />
      <div className="prose prose-lg max-w-none">
        <div className="border">
          <Image
            src={`/${frontMatter.image}`}
            width={1200}
            height={700}
            alt={frontMatter.title}
          />
        </div>
        <h1 className="mt-12">{frontMatter.title}</h1>
        <span>{frontMatter.date}</span>
        <div className="space-x-2">
          {frontMatter.categories.map((category) => (
            <span key={category}>
              <Link href={`/categories/${category}`}>
                {category}
              </Link>
            </span>
          ))}
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-9">{toReactNode(content)}</div>
          <div className="col-span-3">
            <div
              className="sticky top-[50px]"
              dangerouslySetInnerHTML={{ __html: toc }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

const toReactNode = (content) => {
  return unified()
    .use(rehypeParse, {
      fragment: true,
    })
    .use(rehypeReact, {
      createElement,
      components: {
        a: MyLink,
        img: MyImage,
      },
    })
    .processSync(content).result;
};


const MyLink = ({ children, href }: Props) => {
  return (
    <Link href={href}>
      {children}
    </Link>
  );
};

const MyImage = ({ src, alt, ...props }: Props) => {
  return <Image loader={cloudflareLoader} unoptimized={true} src={src} alt={alt} {...props} />;
};


export default Post;
