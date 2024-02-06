export const globalErrorMiddleware = (err,req,res,next)=>{
    const {message} = err; 
    const code = err.statusCode || 500;
    res.status(code).json({error : message , statusCode : code})
}