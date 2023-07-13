import express from 'express'
import jwt from 'jsonwebtoken'
const { Router } = express
const router = new Router()
import passport from 'passport'

router.post('/login', (req,res) => {
    if(req.body.username == 'nacho@mail.com' && req.body.password == 1234){
        let token = jwt.sign({
            email : req.body.username,
            password: req.body.password
        },
        'secreto123',
        {expiresIn: '24h'}
        )
        //res.send({
          //  message: 'user logeado',
            //token  //si yo lo devuelvo por el objeto res, lo puede ver cualquier persona, aca puede acceder desde el localstorage, pero no es seguro, por lo tanto seria un error enviar el token desde alli, lo enviaremos desde una cookie, para que el front end pueda acceder
        //})

        //haciendolo con cookies
        //dentro del objeto res, podemos crear la cookie, primer arg nombre de la cookie, segundo lo que almacenará, tercero la configuracion, en este caso, la edad maxima de 24 hs

        res.cookie('cookieToken', token, {maxAge: 60*60*1000, httpOnly:true})
        .send({message:'user logged'})
        //ahora solo recibe el frontend que ha sido loggeado el usuario, esto es una buena practica, almacenar en una cookie el token

        //hay un problema, estas pueden ser accedidas por un codigo ajeno, es riesgos, esto lo solucionamos con una propiedad llamada httpOnly: true cuando creamos la cookie, de esta manera la hacemos mas segura.
    }

    //ahora en mas, el login lo vamos a hacer con jwt, con passport vamos a crear un middleware para pasarle a las rutas privadas el token para que el user acceda
})

//creamos una ruta en la cual solo tendran acceso los que tengan ese token, ya que con  passport.authenticate('jwt') pasa por este middleware que los lleva a la estrategia jwt, que justamente es el argumento que debo pasar, el nombre de la estrategia que quiero que se use, ya que podemos tener muchas estrategias, y le decimos tambien q no nos cree una session
router.get('/home', passport.authenticate('jwt',{session:false}) , (req,res) => {
    res.send(req.user) //si es exitoso el logueo, uso req.user, que gracias a el done y payload, podemos acceder, y buscamos el user
})

export {router}