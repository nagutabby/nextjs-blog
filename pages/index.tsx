import fs from 'fs';
import matter from 'gray-matter';
import Pagination from '../components/pagination';
import PostCard from '../components/postcard';

type Props = {
  posts: {
    post: {
      slug: string
      frontMatter: {
        image: string
        title: string
        date: string
      }
    }
  }
  pages: string[]
  current_page: number
}



const PAGE_SIZE = 2;

const range = (start: number, end: number, length = end - start + 1) => {
  return Array.from({ length }, (_, i) => start + i);
}
export const getStaticProps = () => {
  const files = fs.readdirSync('posts');
  const posts = files.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fileContent = fs.readFileSync(`posts/${fileName}`, 'utf-8');
    const { data } = matter(fileContent);
    return {
      frontMatter: data,
      slug,
    };
  });

  const sortedPosts = posts.sort((postA, postB) =>
    new Date(postA.frontMatter.date) > new Date(postB.frontMatter.date) ? -1 : 1
  );

  const pages = range(1, Math.ceil(posts.length / PAGE_SIZE));

  return {
    props: {
      posts: sortedPosts.slice(0, PAGE_SIZE),
      pages,
    },
  };
};

export default function Home({ posts, pages }: Props) {
  return (
    <div className="my-8">
      <div className="grid grid-cols-3 gap-4">
        {Object.values(posts).map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination pages={pages} current_page={1} />
    </div>
  );
}
