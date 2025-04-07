import userRouters from './UserRouters.js';


const routers = (app) => {
    app.use('/api/user/', userRouters);
};

export default routers;
