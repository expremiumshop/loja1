import {
    createServerClient,
  } from "@supabase/ssr"
  
  import {
    NextResponse,
    type NextRequest,
  } from "next/server"
  
  export async function proxy(
    request: NextRequest
  ) {
    let response =
      NextResponse.next({
        request,
      })
  
    const supabase =
      createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
  
            setAll(cookiesToSet) {
              cookiesToSet.forEach(
                ({
                  name,
                  value,
                  options,
                }) => {
                  request.cookies.set(
                    name,
                    value
                  )
  
                  response =
                    NextResponse.next({
                      request,
                    })
  
                  response.cookies.set(
                    name,
                    value,
                    options
                  )
                }
              )
            },
          },
        }
      )
  
    await supabase.auth.getClaims()
  
    return response
  }
  
  export const config = {
    matcher: [
      /*
       * Executa em páginas da aplicação,
       * mas ignora arquivos estáticos.
       */
      "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
  }