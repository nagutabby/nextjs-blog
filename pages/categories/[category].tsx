import fs from 'fs';
import matter from 'gray-matter';
import { GetStaticProps } from 'next';
import PostCard from '../../components/postcard';

type Props = {
  params: {
    category: string
  }
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
}

export const getStaticProps = ({ params }: Props) => {
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

  const category = params.category;

  const filteredPosts = posts.filter((post) => {
    return post.frontMatter.categories.includes(category);
  });

  const sortedPosts = filteredPosts.sort((postA, postB) =>
    new Date(postA.frontMatter.date) > new Date(postB.frontMatter.date) ? -1 : 1
  );

  return {
    props: {
      posts: sortedPosts,
    },
  };
};

export const getStaticPaths = () => {
  const categories = ['react', 'laravel'];
  const paths = categories.map((category) => ({ params: { category } }));

  return {
    paths,
    fallback: false,
  };
};

const Category = ({ posts }: Props) => {
  return (
    <div className="my-8">
      <div className="grid grid-cols-3 gap-4">
        {Object.values(posts).map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Category;
