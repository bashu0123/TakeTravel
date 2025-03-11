const express = require('express')

const dotenv = require('dotenv');
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser')
const globalErrorHandler = require('./controller/errorController');

const { connectDatabase } = require('./config/database');
dotenv.config();
connectDatabase();
app.use(cors({
    origin: true, // Allow requests from this origin
    credentials: true, // Allow cookies to be sent with the request
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    optionsSuccessStatus: 204,
}));


//using middlewares
app.use(cookieParser());
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb',extended:true}));

const AppError = require('./utils/AppError');


const bookingRoutes  = require('./route/bookingRoute');
const user = require('./route/userRoute');
const packageRoutes  = require('./route/packageRoute');
const contactRoutes = require('./route/contactRoutes');

app.use('/users', user);
app.use('/packages', packageRoutes );
app.use('/bookings', bookingRoutes );
app.use('/contacts', contactRoutes);


app.all('*',(req,res,next)=>{
    next(new AppError(`cant find ${req.originalUrl} on this server`,400))
});
app.use(globalErrorHandler);

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Error starting server:', err);
});
