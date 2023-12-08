import path from "path";
import http from 'http';
import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';

const app = express();

import routes from './routes/routes';

// all environments
app.set('port', process.env.PORT || 3001);

// Body parser middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// CORS middleware to enable cross-origin requests
app.use(cors({
  origin: '*'
}));

// Define your routes
app.use(routes);

// Create an HTTP server and listen on the specified port
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
