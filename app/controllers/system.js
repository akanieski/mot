module.exports = {
    
    info: {
        secure: false,
        action: function*(req, res, next) {
            
            bastion.log(req.config);
            
            res.ok({
                hello: 'world' 
            });
            
        }
    }
    
}