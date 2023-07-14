import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
//uno crea la estrategia y el otro verifica que la cookie que tiene el token este bien

const initializatePassport = () => {
    passport.use('jwt', new JwtStrategy({
        //primer argumento
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),  //aca se deserializa 
        //aca le digo que el jwt lo extraigo desde una cookie, y ejecuto la funcion que verifica eso, y su metodo que me aclara que es desde los extractors, y recibe un array, que recibe el nombre de la funcion encargada de extraer a la cookie
        secretOrKey: 'secreto123'
        //y este es el secreto, que pusimos cuando se creo el token en el metodo post en routes auth
    },
    //aca creamos una funcion asíncrona, donde el primer argumento es el resultado del argumento anterior, es decir, si sale todo bien, en jwt_payload vamos a tener la info del usuario, y luego tenemos el done para finalizar
    async (jwt_payload, done) => {

        try{
            return done(null, jwt_payload)

            //gracias a este done, que me envia el jwt_payload, por fuera de la estrategia, cuando se use, los endpoints tendran acceso a req.user y podran acceder a la info del usuario
        } catch (err) {
            console.log(err)
            done(null, err)
        }
    }) 
    )
}


//ahora vamos a crear la funcion para extraer la cookie que usaremos en el extractor.
//usamos el objeto req ya que con eso vamos a buscar la cookie, esto es lo q va a usar el extractor para ver si existe la cookie, si existe, se la pasamos desde aca
const cookieExtractor = (req) => {
    let token = null
    if( req && req.cookies){
        token = req.cookies['cookieToken']   //aca puedo tener muchas cookies, asi que con llaves puedo acceder a una propiedad con su nombre, aca pongo el nombre de la cookie creada en auth login, especificamente en res.cookie('cookieToken', ...)
    }                                        //tener cuidado en poner cookies con s
    console.log(token)
    return token 
}

//middleware para retornar un mensaje mas completo y bonito en caso de que no se autorice a ingresar a las rutas privadas
//siempre los parametros son los mismos

const passportCall = (st) => {  //puede recibir estrategias para usarlas
    return(req,res,next)=> {
        passport.authenticate(st, function(err, user, info){ //y aca ejecutamos la autenticación, ANTES DEL MIDDLEWARE DE AUTENTICACION, para poder manejar los datos, le pasamos la estrategia a usar y 
        if(err) return next(err)  //si hay un error, me devuelve el error
        if(!user){
            console.log(info.message)
            return res.status(401).send({message: info.message ? info.message : info.toString()}) //se hace ternario pq puede ser asincrono el info.message, entonces si existe pasamelo, si no, pasame info entero en string
        }
        req.user = user //si pasa todo, req.user va a ser user  
        next()
    })(req,res,next) //la ejecuto con los parametros  SIEMPRE VA A SER ASI ESTA FUNCION 
    }
}

//aca hago una funcion para los diferentees roles, puedo ser un usuario o un administrador, para esto, hay que hacer una logica para darle rol a cada persona
const authorization = (role) => {
    return async (req,res,next) => {
        if(!req.user) return res.status(401).send({error: 'no autorizado'}) //siempre los errores en middlewares de autorizacion son SIEMPRE 401
        //cuando un usuario hace login, debemos pasarle un role, entonces aca podemos diferenciarlos
        if(req.user.role != role) return res.status(401).send({error: 'no permissions'})
        next()  
        //si no existe el usuario le dice que no tiene permiso, si existe, pero es diferente al rol que le pasamos, le dice que no tiene permisos, y si nada es negativo, ejecutamos el next y prosigue la funcion en la ruta
    }
}

export {initializatePassport, passportCall, authorization}