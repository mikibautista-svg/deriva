# Deriva — jardín bioluminiscente

Juego HTML5 autónomo (un solo archivo, sin dependencias ni build). `index.html` es
todo lo que necesitas: ábrelo directamente en un navegador o súbelo a cualquier
hosting estático.

## Publicarlo

### Opción A — GitHub Pages (gratis, tu propio dominio de github.io)

1. Crea un repositorio nuevo en GitHub (puede ser público o privado; Pages
   gratis requiere público, o cualquiera si tienes GitHub Pro/Team).
2. Desde esta carpeta:
   ```
   git init
   git add index.html README.md
   git commit -m "Deriva: primer despliegue"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Source → Deploy from a branch → main / (root)**.
4. En un minuto tu juego estará en `https://<tu-usuario>.github.io/<tu-repo>/`.

Alternativas equivalentes, igual de válidas: arrastrar la carpeta a
[Netlify Drop](https://app.netlify.com/drop), o `vercel deploy` con la
CLI de Vercel. Ambas dan una URL pública al instante sin tocar `index.html`.

### Opción B — Portal de juegos (CrazyGames, Poki, Itch.io, Y8...)

Estos portales alojan el archivo por ti y te dan tráfico de jugadores.
Regístrate como desarrollador en el portal elegido y sube `index.html`
(o un .zip que lo contenga) siguiendo su proceso de publicación. No hace
falta que toques el código: la detección de sus SDKs de anuncios ya está
integrada (ver más abajo).

## Publicidad entre niveles

Ahora mismo el anuncio entre niveles es un texto ficticio ("Anzuelos
Luminosos S.A...") para que la pantalla de transición no quede vacía.
El código ya tiene el punto de enganche real listo, cerca del principio
del `<script>` en `index.html` (busca "PUBLICIDAD — punto de integración
real"). Hay dos caminos, y **puedes activar cualquiera de los dos sin
tocar el resto del juego**:

### Si publicas en tu propio dominio (Opción A): Google AdSense

1. Crea una cuenta en [Google AdSense](https://adsense.google.com/) con
   el dominio donde publicaste el juego, y espera la aprobación (puede
   tardar días; necesitas contenido real y tráfico mínimo).
2. Una vez aprobado, copia tu ID de editor (algo como `ca-pub-1234567890123456`).
3. En `index.html`, reemplaza:
   ```js
   var AD_CLIENT_ID = "ca-pub-XXXXXXXXXXXXXXXX";
   ```
   por tu ID real. Eso activa automáticamente la carga del script de
   AdSense y la "Ad Placement API" de Google (`adBreak`), pensada
   específicamente para anuncios intersticiales entre niveles de un
   juego — es la llamada que ya está puesta en `goToInterstitial()`.
4. Sin tu ID real, `ADSENSE_ENABLED` queda en `false` y no se carga
   ningún script externo: el juego sigue funcionando igual, solo sin
   anuncios reales (verás el texto ficticio).

### Si publicas en un portal (Opción B): CrazyGames / Poki

Estas plataformas inyectan su propio SDK cuando alojan tu build, según
el proceso de alta de cada una:
- [CrazyGames for Developers](https://developer.crazygames.com/)
- [Poki for Developers](https://developers.poki.com/)

`showInterstitialAd()` en `index.html` ya detecta `window.CrazyGames` y
`window.PokiSDK` automáticamente y llama a su anuncio intersticial real
en cuanto el SDK está presente — tiene prioridad sobre AdSense. No
necesitas cambiar nada del código; solo sigue el proceso de alta del
portal que elijas (ellos te indicarán si hace falta añadir alguna
etiqueta `<script>` concreta a `index.html`, que iría justo antes de
`</head>`).

## Estructura del juego

- 20 niveles de 25 segundos, dificultad creciente (motas y estrellas
  fugaces cada vez más rápidas).
- Puntuación independiente por nivel, con clasificación de mejores
  puntuaciones guardada en `localStorage` del navegador (persiste entre
  visitas, por dispositivo — no es un ranking global entre jugadores;
  para eso haría falta un backend).
- Agujero negro: si lo tocas, pierdes toda la luz del nivel en curso.
- Pausa y salida al menú desde la partida.
