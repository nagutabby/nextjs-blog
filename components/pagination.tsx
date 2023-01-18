import Link from 'next/link';

type Props = {
  pages: string[]
  current_page: number
}

const Pagination = ({ pages, current_page = 1 }: Props) => {
  return (
    <div className="flex items-center space-x-1 mt-8">
      {pages.map((page) => (
        <Link href={`/page/${page}`} key={page} className={`px-4 py-2 border hover:bg-black hover:text-white ${current_page === Number(page) && 'bg-black text-white'
          }`}>

          {page}
        </Link>
      ))}
    </div>
  );
};

export default Pagination;
