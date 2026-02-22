-----------INSTRUCCIONES DE EJECUCION-----------

Primero se necesita clonar el repositorio:
git clone https://github.com/tu-usuario/tu-repo.git
cd prueba-frontenddev

despues de esto, instale las dependencias
con el comand: npm install

y ejecute: npm run dev


------------JUSTIFICACION TECNICA---------------
En el proyecto se utilizaron las tecnologias mencionadas en los requisitos
tales como Tailwind, Next.js, Zustand, Typescript, etc. Asi como las APIs en el pdf mencionadas.

Por mi parte decidi hacer uso de lucid react para añadir al proyecto iconos, asi como las estrellas de favoritos en los posts
de las cuales su funcionamiento se desarrollo con Zustand.
Tambien incluí en la parte gráfica diseños hechos por mi para el apartado de menu en el dashboard, desde el inicio
queria usar tarjetas para el menu, pero al realizarlo se veia muy vacio, asi que decidi llenarlo
con algo inspirado en La noche estrellada, la idea inicial era programarlo
pero al realizar dos lineas me di cuenta de que seria muy tedioso asi que decidi dibujarlo en mi celular
con PENUP y pasarlo a SVG para usarlo en la interfaz, eso fue mucho mas sencillo y creo un mejor resultado visual.

A partir de ese cambio se creo el resto de la interfaz, pensada en ser sobria para encajar con 
los dibujos decorativos, asi como con fondo azul y controles con efecto de cristal.

Para el apartado de usuarios, decidi implementar logica de cambio de rol, al ser yo quien decidio que usuarios eran Admin
ya que la API no contaba con esos datos, fue mas sencillo hacer el cambio de rol, tambien cree botones especificos para los Admins
como el seleccionar, solo aparece si el usuario logueado es un administrador, esta misma logica aparece en el apartado de Posts, solo los adminisradores
pueden crear, editar y eliminar posts.

Por ultimo en el apartado de Libros, la funcionalidad es igual para todos los usuarios.
