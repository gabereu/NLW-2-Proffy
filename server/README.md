# Routes

## User

### POST /user

    Route to create an user
    
- body template

```js
{
    "name": string,
    "surname": string,
    "email": string,
    "password": string,
}
```    
 
### POST /user/auth

    Route to auth a user
    Auth based on a JWT stored in a cookie session for better security
    
- body template

```js
{
    "email": string,
    "password": string,
}
```     
### POST /user/logout

    Route to logout a user, just clear the cookie session.
    No body.
    
- body template

### POST /user/forgot_password

    Route to get reset password token.
    Token send by email.
    
- body template

```js
{
    "email": string,
}
```     
### POST /user/reset_password

    Route to reset password with correct token.
    
- body template

```js
{
    "email": string,
    "password": string,
    "token": string,
}
```  

### GET /user/isAuthenticated

    Route to check if the user is authenticated.
    No body.
    
- body template
     
### GET /user/profile

    Route to get user profile.
    No body.
    
- body template
     
### PATCH /user/profile

    Route to update user profile.

- body template

```js
{
    "name"?: string,
    "surname"?: string,
    "whatsapp"?: string,
    "bio"?: string,
    "avatar"?: string,
}
```     


## Classes

### POST /classes

    Route to create a class.

- body template

```js
{
    "subject": string,
    "cost": string,
    "schedule": string,
}
```

### GET /class

    Route to get user class.
    No body.

### PATCH /classes

    Route to update user class.
    No body

- body template

```js
{
    "subject": string,
    "cost": string,
    "schedule": string,
}
```

### get /classes

    Route to get classes to connect.

- body template

```js
{
    "subject": string,
    "time": string,
    "week_day": number, // [0-6]
}
```

## Connections

### POST /connections
    Route to register a new connection

- body template

```js
{
    "user_id": number, //id from user connected/Proffy
}
```
### GET /connections
    Route to get number of connections
    No body.

