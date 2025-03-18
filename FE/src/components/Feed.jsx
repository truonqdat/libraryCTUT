import React from "react";
import CategoryBook from "./CategoryBook";
import CategoryNews from "./CategoryNews";
import SearchInput from "./SearchInput";
import bookService from "../services/bookService";
import newsServices from '../services/newsServices';

function Feed(props) {
  const [booksNews, setBooksNew] = React.useState([]);
  const [newsNews, setNewsNew] = React.useState([]);

  React.useEffect(() => {
    const fetchBooksNew = async () => {
      try {
        const booksNew = await bookService.getBooksNew();
        setBooksNew(booksNew);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    const fetchNewsNew = async () => {
      try {
        const newsNew = await newsServices.getAllNewsHome();
        setNewsNew(newsNew);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchNewsNew()
    fetchBooksNew();
  }, []);

  return (
    <div>
      <SearchInput />
      <CategoryBook linkTo={"/sach-moi"} title={"Sách mới"} bookList={booksNews} isHomePage={true} />
      <CategoryNews linkTo={"/tin-tuc"} title={"Tin tức mới"} newsList={newsNews} isHomePage={true} />
    </div>
  );
}

export default Feed;
