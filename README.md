# hackday-2019
This project was created during the Shazam Hackday Spring 2019

# Project description:
The projects main purpose is to display details regarding a song recognised after the upload of a .wav file.
It then gives the user the option to discover the artists most used words, with frequency visualised through a bar chart and a wordcloud. The latter is done by fetching the artists top 20 songs, aggregating the texts, performing basic NLP clean up(removal of non-alphabetic characters, stopwords, single letter words), then storing in a dictionary the frequency of each word and finally plotting them using highcharts plotting package.

# How to run:
- clone repository
- in project folder: npm install (to install server dependencies)
- in client folder: npm install (to install client dependencies)
- cd to project root folder
- npm run dev (starts both the client and server(using concurrently), including debugger --inspect)
- nodemon is used to automatically restart server, whenever there are changes in server.js

# Technologies used include:
- ReactJS
- NodeJS
- Fetch and Axios API
- Express
- Highchart

