/* eslint-disable react/react-in-jsx-scope */
import { createBrowserRouter } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import ReaderProfile from '../pages/ReaderProfile'
import PageNotFound from '../pages/PageNotFound'
import SearchPage from '../pages/SearchPage'
import Feed from '../components/Feed'
import CategoryAll from '../components/CategoryAll'
import BookDetails from '../components/BookDetails'
import NewsDetail from '../components/NewsDetail'
import Contact from '../pages/Contact'
import Profile from '../components/Profile'
import RentHistory from '../components/RentHistory'
import News from '../components/News'
import FavoritBooks from '../components/FavoriteBooks'
import AllFavoriteBooks from '../components/AllFavoriteBooks'
import UpdatePassword from '../components/UpdatePassword'
import Punish from '../components/Punish'
import BooksNew from '../components/BooksNew'
import FormContact from "../components/ContactComponent/FormContact"
import ContactList from "../components/ContactComponent/ContactList"
import AboutUs from "../components/ContactComponent/AboutUs"


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: '/',
        element: <Feed />
      },
      {
        path: '/tim-kiem',
        element: <SearchPage />
      },
      {
        path: '/tin-tuc',
        element: <News />
      },
      {
        path: '/sach-yeu-thich',
        element: <AllFavoriteBooks />
      },
      {
        path: '/sach-moi',
        element: <BooksNew />
      },
      {
        path: '/danh-muc',
        element: <CategoryAll />
      },
      {
        path: '/danh-muc/:id',
        element: <CategoryAll />
      },
      {
        path: '/chi-tiet-sach/:id', 
        element: <BookDetails /> 
      },
      {
        path: '/chi-tiet-tin-tuc/:id', 
        element: <NewsDetail /> 
      }
    ]
  },
  {
    path: '/ho-so-doc-gia',
    element: <ReaderProfile />,
    children: [
      {
        path: '/ho-so-doc-gia',
        element: <Profile />
      },
      {
        path: '/ho-so-doc-gia/lich-su-muon',
        element: <RentHistory />
      },
      {
        path: '/ho-so-doc-gia/phi-phat',
        element: <Punish />
      },
      {
        path: '/ho-so-doc-gia/cap-nhat-mat-khau',
        element: <UpdatePassword />
      },
      {
        path: '/ho-so-doc-gia/yeu-thich',
        element: <FavoritBooks />
      }
    ],
    errorElement: <PageNotFound />
  },
  {
    path: '/lien-he',
    element: <Contact />,
    children: [
      {
        path: '/lien-he',
        element:<FormContact/>
      },
      {
        path: '/lien-he/lien-he-gan-day',
        element:<ContactList/>
      },
      {
        path: '/lien-he/thong-tin-lien-he',
        element:<AboutUs/>
      }
    ],
    errorElement: <PageNotFound />
  },
  {
    path: '/dang-nhap',
    element: <Login />,
    errorElement: <PageNotFound />
  },
  {
    path: '*',
    element: <PageNotFound />
  }
])
