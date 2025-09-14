require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const tenantRoutes = require('./routes/tenantRoutes')
const cookieParser = require('cookie-parser');  
const app = express();
app.use(cors({
origin: ['http://localhost:5173', 'https://note-app-frontend-woad.vercel.app'],
  credentials: true,                // if you use cookies for auth
}));

app.use(cookieParser());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/auth', authRoutes);
app.use('/', userRoutes);
app.use('/tenants', tenantRoutes);
app.use('/notes', noteRoutes);


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
