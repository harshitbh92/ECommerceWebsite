//not Found to uske liye

//to handle 404 not found errors
//When a request is made to a URL that doesn't match any defined routes,
//  it creates an error object with a message indicating that the requested URL was not found. 
//  It then sets the HTTP status code to 404 and passes the error to the next 
//  function to be handled by the next middleware in the chain.
const notFound= (req,res,next)=>{
    const error = new Error('Not Found : ',req.originalUrl);
    res.status(404);
    next(error);
}

//Error Handler
//when a route is not found, the notFound middleware will be triggered,
// and when any other error occurs in your application, it will be caught by the errorHandler
const errorHandler = (err,req,res,next)=>{
    const statuscode = res.statusCode == 200?500 :res.statusCode;//200 -> OK & 500 -> Internal Server error
    res.status(statuscode);
    res.json({
        message : err?.message,
        stack : err?.stack,
    });
};

module.exports = {errorHandler,notFound};