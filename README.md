# auth-web-app

## To Run
1. ```npm i``` to install node_modules   
2. Create a ```.env``` file in root folder
3. ```npm start```

### .env

CONSTRING=&lt;connection string for postgresdb&gt; 
PORT=&lt;server port&gt;  
ADMINPASSWORD=  
ACCESS_SECRET_TOKEN=
REFRESH_SECRET_TOKEN=

### PostgresDB

```
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    role VARCHAR(255) NOT NULL
);
```

### ACCESS AND REFRESH SECRET TOKENS

1. Open new terminal
2. Run ```npm i crypto```
3. Start a ```node``` session.
4. Run ```require('crypto').randomBytes(64).toString('hex')``` twice.
5. Use these two generated strings for the two secret tokens.

