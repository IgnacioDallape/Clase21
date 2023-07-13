import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
//uno crea la estrategia y el otro verifica que la cookie que tiene el token este bien

const initializatePassport = () => {
    passport.use('jwt', new JwtStrategy({
        //primer argumento
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
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
    if( req && req.headers.cookie){
        token = req.cookies['cookieToken']   //aca puedo tener muchas cookies, asi que con llaves puedo acceder a una propiedad con su nombre, aca pongo el nombre de la cookie creada en auth login, especificamente en res.cookie('cookieToken', ...)
    }
    console.log(token)
    return token 
}
export {initializatePassport}