import React from 'react'
import CategoryBook from './CategoryBook'
import bookService from '../services/bookService'
import Pagination from './Pagination'
import { Stack } from '@mui/material'
import SearchInput from './SearchInput'
import { useParams } from 'react-router-dom'

function BooksNew(props) {
  const [books, setBooksNew] = React.useState([])
  const { id } = useParams()

  const countNews = books.length
  const itemsPerPage = 6
  const totalPages = Math.ceil(countNews / itemsPerPage)
  const [currentPage, setCurrentPage] = React.useState(1)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  React.useEffect(() => {
    const fetchBooksNew = async () => {
      try {
        const booksNew = await bookService.getBooksNew()
        setBooksNew(booksNew)
      } catch (error) {
        console.error('Error fetching books:', error)
      }
    }

    fetchBooksNew()
  }, [])

  return (
    <>
      <SearchInput />
      <CategoryBook
        title={'Sách mới'}
        bookList={books}
        start={startIndex}
        end={endIndex}
        isHomePage={false}
      />
      {totalPages > 1 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : null}
      {books.length === 0 ? (
        <Stack sx={{ margin: '0 auto', textAlign: 'center', fontSize: '2rem' }}>
          Hiện không có sách mới
        </Stack>
      ) : null}
    </>
  )
}
export default BooksNew
