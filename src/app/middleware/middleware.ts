import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken"); //REVISA SI EL USUARIO TIENE TOKEN

  if (!token) {
    console.log("Redirigiendo al login porque no hay token");
    return NextResponse.redirect(new URL("/", req.url));
  } //SI NO TIENE TOKEN ENVIA DE VUELTA AL USUARI AL LOGIN

  return NextResponse.next();
}
// CON ESTO EL MIDDLEWARE SABE QUE DEBE CUIDAR ESAS PAGINAS
export const config = {
  matcher: ["/dashboard/:path*", "/users/:path*", "/posts/:path*", "/books/:path*"],
};