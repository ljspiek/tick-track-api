module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || '://postgres@localhost/tick-track',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL ||
      "http://localhost:3000/api"
  }