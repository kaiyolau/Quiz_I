const express = require('express');
const app = express();
const knex = require('./db/client');
// Require method-override middleware
const methodOverride = require('method-override'); 

//--------------------BODY PARSER and URLENCODED MIDDLEWARE-------------------->
app.use(express.urlencoded({extended: true}))

//-----------------Method Override Middleware--------------------------
app.use(methodOverride((req,res) => {
    if (req.body && req.body._method) {
        const method = req.body._method;
        return method
    }
}))

//------Cookie Parser------>
const cookieParser = require('cookie-parser')
app.use(cookieParser())

//------Custom Middleware-------->
app.use((req, res, next) => {
    const username = req.cookies.username
    //res.locals are properties set and are available in any views
    //almost like a global variable
    res.locals.username = '';

    if(username){
        res.locals.username = username;
        console.log(`Signed in as ${username}`)
    }
    next();
    // All middleware functions have an optional parameter **next()** 
    //beside (request, response) parameters which is needed to pass along 
    //the request to the next function in the chain just simply by calling it
    //Packaged middleware might already have the next() implemented, so you might not need to specify it
    //But always include it in your own middleware
    //After the we are done with the middleware then we pass the request to next 
    //middleware function but, if the middleware didn't run successfully then the 
    //response will be given from the middleware
})

//-----STATIC ASSETS-------->
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')));

//Logging Middleware----->
const logger = require('morgan');
const req = require('express/lib/request');
app.use(logger('dev'));






//---------------------------ROUTERS--------------------------------->
//Root page

app.get('/', (request,response) => {
  knex('clucks')
  .orderBy('created_at', 'desc')
  .then(clucks => {
    response.render('clucks/index', {clucks: clucks})
  })
})



app.get('/sign_in', (request, response) => {
    response.render('sign_in')
})

//'----------Sign in POST request-------->
app.post('/sign_in', (req, res) =>{
    // res.send(req.body)   //-> this is available through urlencoded
    const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 // a day in milliseconds
    const username = req.body.username
    
    res.cookie('username', username, {maxAge: COOKIE_MAX_AGE})
    res.redirect('/')
})

//'----------Sign out POST request-------->
app.post('/sign_out', (req, res) =>{
    res.clearCookie('username')
    res.redirect('/')
})

























// ---------------POST ROUTER ACCESSING POST ROUTES-----------
const clucksRouter = require('./routes/clucks');
app.use('/clucks', clucksRouter)

//SET VIEW ENGINE---->
app.set('view engine', 'ejs')
app.set('views', 'views')

//---Start listening to the server----->
const PORT = 3000;
const DOMAIN = "localhost" //loopback address: 127.0.0.1

app.listen(PORT, DOMAIN, () => {
    console.log(`Server is listening on http://${DOMAIN}:${PORT}`)
})