import UserRouters from './UserRouters.js';
import FacultyRouters from './FacultyRouters.js'
import CategoryRouters from './CategoryRouters.js'
import BookRouters from './BookRoutes.js'
import BookCopyRouters from './BookCopyRoutes.js'
import TransactionLog  from './TransactionLogRouters.js';
import Reservation from './ReservationRouters.js'
import Borrow from './BorrowRecordRouters.js'


const routers = (app) => {
    app.use('/api/user/', UserRouters);
    app.use('/api/faculties/', FacultyRouters);
    app.use('/api/categories/', CategoryRouters);
    app.use('/api/books/', BookRouters);
    app.use('/api/copies/', BookCopyRouters);
    app.use('/api/transactions/', TransactionLog);
    app.use('/api/reservations/', Reservation);
    app.use('/api/borrows/', Borrow);



};

export default routers;
