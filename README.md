# Udagram Image Filtering Microservice

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.


## How to use:

1. Initialize a new project: `npm i`
2. run the development server with `npm run dev`
3. Build the project and compress into a .zip  `npm run dev`


### Deploying your system

1. setup your aws profile
2. setup the environment variables for your aws profile
3. install [eb-cli](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.htm)
4. after installing the eb-cli run in our terminal eb-create to configure the elasticbeanstalk.
5. since the projects builds a zip file to be deployd, we must add the following code into .elasticbeanstalk/config.yml
```yml
deploy:
  artifact: ./www/Archive.zip
```
eb will look for this file to deploy.
6. Deploy your change running: eb deploy --stage


