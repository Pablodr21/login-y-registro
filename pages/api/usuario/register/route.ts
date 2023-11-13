import { emailRegex,passwordRegex } from "@/pages/utils/regex";
import { hashPassword } from "@/pages/utils/crypto";
import { PrismaClient } from '@prisma/client'
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient()



export async function POST(req:Request) {
    const usuario = await req.json()
    
 
    if(Object.values(usuario).includes(undefined)){
        return new Response ("Error faltan datos ", {status:404});

    }

    if(!usuario.email.match(emailRegex)){
        return new Response("email invalido" , {status:400});
    }

    if(!usuario.password.match(passwordRegex)){
        return new Response("contraseña invalida" , {status:400});

        //encriptar la contraseña genSalt(cantidad de veces que se va a encriptar) hash
        const hash = await hashPassword(usuario.password)
        const usuarioGuarr = { ...usuario, password: hash}
        const usuarioSubido = await prisma.usuario.create({data:usuarioGuarr});

        if(!usuarioGuarr)
         return new Response ("No se subio usuario", {status:500})
          
         const token = sign(usuarioGuarr, process.env.TOKEN_SECRET as string);
         const respuesta = {...usuarioGuarr, token};


         return new Response(JSON.stringify(respuesta));
    }
    

    

     
    return new Response ("Los datos son correctos");
}