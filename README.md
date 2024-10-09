## Threadless

### What is Threadless?

Threadless is social media/art gallery that allows users to publish their artwork and keep in touch with their favorite artists.

#### Getting started

##### Create a .env file with the following content and update the variables

```
MONGO_URI=
PORT=5000
JWT_SECRET=
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

##### Generate JWT_SECRET:

Open the console and paste the following command:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))
```

Copy the output and update the JWT_SECRET in the .env file.
