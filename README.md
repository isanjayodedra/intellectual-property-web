# Intellectual Property WEB

Intellectual property (IP) refers to creations of the mind, like inventions, literary and artistic works, designs, and symbols, names, and images used in commerce, protected by law through patents, copyright, and trademarks.

## 📦 Project Structure

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose installed

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/isanjayodedra/intellectual-property-web.git
   cd intellectual-property-web
   npm install
   ```

2. Copy environment files:
   ```bash
   cp .env.example .env
   ```

3. Start all services with Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. Access services:
   - http://localhost:3000
   
5. MySQL Database:
   - Host: `localhost`
   - Port: `3306`
   - User: `ipcms_user`
   - Password: `ipcms_password`
   - Database: `ipcms_db`

6. Redis Server:
   - Host: `localhost`
   - Port: `6379`

## ⚙️ Services Overview

| Service | Port | Description |
|:--------|:-----|:------------|
| website | 3000 | Entry point for all API traffic |


## 🛠 Tech Stack

- **ORM**: [Sequelize](https://sequelize.org/)  orm for object data modeling
- **Migration and Seed**: DB migration and Seed using [Sequelize-CLI](https://github.com/sequelize/cli) 
- **Authentication and authorization**: using [passport](http://www.passportjs.org)
- **Error handling**: centralized error handling
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using [winston](https://github.com/winstonjs/winston) 
- **Testing**: unittests using [Mocha](https://mochajs.org/)
- **Caching**: Caching using [Redis](https://redis.io/)
- **Bidirectional Communication**: using [Scoket](https://socket.io/)
- **Job scheduler**: with [Node-cron](https://www.npmjs.com/package/node-cron)
- **Dependency management**: with [Yarn](https://yarnpkg.com)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Docker support**
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)

## 🔒 Security Features

- JWT Token Authentication
- Password Hashing (bcryptjs)
- Environment Variable Management (.env)

## Commands

Running locally:

```bash
npm run dev
```

Running in production:

```bash
npm run start
```

Testing:

```bash
# run all tests
npm run test

```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
#Server environment
NODE_ENV=development
#Port number
PORT=4000

#Db configuration
DB_HOST=db-host
DB_USER=db-user
DB_PASS=db-pass
DB_NAME=db-name


# JWT secret key
JWT_SECRET=your-jwt-secret-key
# Number of minutes after which an access token expires
JWT_ACCESS_EXPIRATION_MINUTES=5
# Number of days after which a refresh token expires
JWT_REFRESH_EXPIRATION_DAYS=30

#Log config
LOG_FOLDER=logs/
LOG_FILE=%DATE%-app-log.log
LOG_LEVEL=error

#Redis
REDIS_HOST=redis-host
REDIS_PORT=6379
REDIS_USE_PASSWORD=no
REDIS_PASSWORD=your-password

#s3 bucket
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_S3_BUCKET_NAME=your_bucket_name

```

## Project Structure

```
specs\
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--dao\            # Data Access Object for models
 |--db\             # Migrations and Seed files
 |--models\         # Sequelize models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--helper\         # Helper classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--cronJobs.js     # Job Scheduler
 |--index.js        # App entry point
```

## 🧪 Testing

```javascript
// auth-service/tests/auth.test.js

const request = require('supertest');
const app = require('../src/index');

describe(' Login API', () => {
  it('should login successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'sanjay@example.com',
        password: 'Test@1234',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
```

Run tests with:
```bash
npm run test
```

## 📄 License

This project is licensed under the [MIT](LICENSE)

---

_Developed with ❤️ by [Sanjay Odedra](https://github.com/isanjayodedra)_
