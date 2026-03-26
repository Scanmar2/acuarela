import React, { useState, useMemo, useCallback, useEffect } from "react";

const COLORS = [
  { id:"hym", name:"Hansa Yellow Med.", pigment:"PY97", hex:"#f5e24d", cat:"yellow" },
  { id:"isy", name:"Isoindolinone Yellow", pigment:"PY110", hex:"#e8c82a", cat:"yellow" },
  { id:"ng", name:"New Gamboge", pigment:"PY150", hex:"#e8a517", cat:"yellow" },
  { id:"yo", name:"Yellow Ochre", pigment:"PY43", hex:"#c9982a", cat:"yellow" },
  { id:"qg", name:"Quinacridone Gold", pigment:"PO48+PY150", hex:"#c4892a", cat:"yellow" },
  { id:"rs", name:"Raw Sienna", pigment:"PBr7", hex:"#c89848", cat:"yellow" },
  { id:"bt", name:"Buff Titanium", pigment:"PW6:1", hex:"#e8dcc0", cat:"yellow" },
  { id:"po", name:"Pyrrol Orange", pigment:"PO73", hex:"#e85c1a", cat:"red" },
  { id:"pr", name:"Pyrrol Red", pigment:"PR254", hex:"#d42a1e", cat:"red" },
  { id:"op", name:"Opera Pink", pigment:"PR122+BV10", hex:"#ff3ca0", cat:"red" },
  { id:"tro", name:"Transp. Red Oxide", pigment:"PR101", hex:"#a0421e", cat:"red" },
  { id:"bsl", name:"Burnt Sienna Light", pigment:"PBr7", hex:"#a06030", cat:"brown" },
  { id:"sep", name:"Sepia", pigment:"PBr7+PBk7", hex:"#3e2a18", cat:"brown" },
  { id:"ub", name:"Ultramarine Blue", pigment:"PB29", hex:"#2832a0", cat:"blue" },
  { id:"pbgs", name:"Phthalo Blue GS", pigment:"PB15:3", hex:"#0a4080", cat:"blue" },
  { id:"cb", name:"Cobalt Blue", pigment:"PB28", hex:"#3058a8", cat:"blue" },
  { id:"cer", name:"Cerulean Blue Chrom.", pigment:"PB36", hex:"#5898c0", cat:"blue" },
  { id:"ct", name:"Cobalt Turquoise", pigment:"PB36:1", hex:"#18a0a8", cat:"blue" },
  { id:"ind", name:"Indigo", pigment:"PBk6+PB15:3+PV19", hex:"#1a2848", cat:"blue" },
  { id:"pgbs", name:"Phthalo Green BS", pigment:"PG7", hex:"#004830", cat:"green" },
  { id:"ug", name:"Undersea Green", pigment:"PB29+PO49", hex:"#2a5848", cat:"green" },
  { id:"lav", name:"Lavender", pigment:"PV15+PB29+PW6", hex:"#9878b0", cat:"violet" },
  { id:"sv", name:"Shadow Violet", pigment:"PV19+PBk6", hex:"#584060", cat:"violet" },
  { id:"mg", name:"Moonglow", pigment:"PB29+PR177+PBk6", hex:"#5a4868", cat:"violet" },
  { id:"jcg", name:"J.Z. Cool Grey", pigment:"Mezcla", hex:"#8a8880", cat:"neutral" },
  { id:"jwg", name:"J.Z. Warm Grey", pigment:"Mezcla", hex:"#988878", cat:"neutral" },
  { id:"lb", name:"Lunar Black", pigment:"PBk11", hex:"#282828", cat:"neutral" },
];

const MIXES = [
  // Negros & Grises
  { id:"m1", name:"Negro Transparente", result:"#0a0a08", colors:["pgbs","pr"], note:"El rey de los negros. Más verde = frío, más rojo = cálido.", section:"negros", tags:"negro oscuro sombra" },
  { id:"m2", name:"Gris Granulado", result:"#3a3848", colors:["ub","bsl"], note:"Clásico 'Jane's Grey'. Granulación hermosa para sombras.", section:"negros", tags:"gris sombra granulado" },
  { id:"m3", name:"Negro Azulado", result:"#181828", colors:["pbgs","pr"], note:"Negro violáceo, muy staining. Noches y sombras dramáticas.", section:"negros", tags:"negro noche oscuro" },
  { id:"m4", name:"Gris Terroso", result:"#484038", colors:["ub","tro"], note:"Gris cálido para piedra, corteza y sombras naturales.", section:"negros", tags:"gris tierra piedra" },
  { id:"m5", name:"Negro Verdoso", result:"#282830", colors:["pgbs","tro"], note:"Negro con matiz verde. Vegetación densa y bosque.", section:"negros", tags:"negro verde bosque" },
  { id:"m6", name:"Gris Azul Frío", result:"#404858", colors:["pbgs","bsl"], note:"Gris frío sin granulación. Metales y cielos tormentosos.", section:"negros", tags:"gris frío metal" },
  // Verdes
  { id:"m7", name:"Sap Green", result:"#4a8830", colors:["pgbs","qg"], note:"Verde natural realista. El más versátil para vegetación.", section:"verdes", tags:"verde vegetación natural" },
  { id:"m8", name:"Verde Musgo", result:"#385828", colors:["pgbs","bsl"], note:"Verde apagado orgánico. Musgo, liquen, otoño.", section:"verdes", tags:"verde musgo otoño" },
  { id:"m9", name:"Verde Tropical", result:"#28a040", colors:["pgbs","ng"], note:"Verde vivo. Hojas jóvenes, plantas tropicales.", section:"verdes", tags:"verde tropical brillante" },
  { id:"m10", name:"Verde Limón", result:"#60a818", colors:["pgbs","hym"], note:"Verde ácido. Hojas a contraluz y brotes.", section:"verdes", tags:"verde limón ácido" },
  { id:"m11", name:"Verde Oliva", result:"#586828", colors:["ub","qg"], note:"Verde cálido con granulación. Olivos, prados mediterráneos.", section:"verdes", tags:"verde oliva mediterráneo" },
  { id:"m12", name:"Verde Brillante", result:"#38a850", colors:["pbgs","ng"], note:"Verde puro y saturado. Césped a pleno sol.", section:"verdes", tags:"verde brillante césped" },
  { id:"m13", name:"Verde Suave", result:"#688848", colors:["cer","qg"], note:"Verde apagado granulante. Follaje lejano.", section:"verdes", tags:"verde suave follaje" },
  { id:"m14", name:"Verde Bosque", result:"#485830", colors:["pgbs","yo"], note:"Verde apagado natural. Árboles maduros y setos.", section:"verdes", tags:"verde bosque árbol" },
  // Naranjas
  { id:"m15", name:"Naranja Dorado", result:"#e87820", colors:["po","ng"], note:"Naranja cálido luminoso. Atardeceres y otoño.", section:"naranjas", tags:"naranja dorado atardecer" },
  { id:"m16", name:"Naranja Fuego", result:"#d85020", colors:["pr","ng"], note:"Naranja rojizo intenso. Puestas de sol y fuego.", section:"naranjas", tags:"naranja fuego rojo" },
  { id:"m17", name:"Naranja Terroso", result:"#b86828", colors:["pr","yo"], note:"Naranja apagado. Arcilla y terracota.", section:"naranjas", tags:"naranja tierra arcilla" },
  { id:"m18", name:"Sienna Transparente", result:"#c87030", colors:["qg","pr"], note:"Naranja terroso transparente. Piel y veladuras.", section:"naranjas", tags:"sienna naranja piel" },
  // Violetas
  { id:"m19", name:"Púrpura Vivo", result:"#8838a8", colors:["op","ub"], note:"⚠️ No permanente. Solo bocetos, Opera Pink se desvanece.", section:"violetas", tags:"violeta púrpura vivo", warn:true },
  { id:"m20", name:"Lavanda Intensa", result:"#7848a0", colors:["op","cb"], note:"⚠️ No permanente. Hermosa pero efímera.", section:"violetas", tags:"lavanda violeta", warn:true },
  { id:"m21", name:"Violeta Terroso", result:"#584060", colors:["ub","tro"], note:"Violeta apagado permanente. Sombras cálidas.", section:"violetas", tags:"violeta tierra sombra" },
  { id:"m22", name:"Berenjena", result:"#483858", colors:["pgbs","pr"], note:"Más rojo que verde: ciruela y berenjena. Permanente.", section:"violetas", tags:"berenjena ciruela oscuro" },
  // Tierras
  { id:"m23", name:"Burnt Umber", result:"#3a2818", colors:["bsl","ub"], note:"Marrón oscuro. Base para troncos y madera.", section:"tierras", tags:"marrón umber tronco madera" },
  { id:"m24", name:"Terracota", result:"#a85828", colors:["yo","pr"], note:"Tejados, cerámica, adobe.", section:"tierras", tags:"terracota tejado ladrillo" },
  { id:"m25", name:"Siena Rojiza", result:"#886830", colors:["qg","tro"], note:"Tierra cálida transparente para veladuras.", section:"tierras", tags:"siena tierra veladura" },
  { id:"m26", name:"Índigo Casero", result:"#483828", colors:["ub","bsl"], note:"Dominancia azul. Más personalidad que el de tubo.", section:"tierras", tags:"índigo azul oscuro" },
  { id:"m27", name:"Ocre Dorado", result:"#b8a060", colors:["yo","bsl"], note:"Arena dorado. Playas y piedra arenisca.", section:"tierras", tags:"ocre arena playa" },
  // Cielos
  { id:"m28", name:"Cielo Despejado", result:"#a8c8e0", colors:["cer"], note:"Solo, muy diluido. Granula ligeramente.", section:"cielos", tags:"cielo azul claro" },
  { id:"m29", name:"Cielo Profundo", result:"#8090c8", colors:["cb"], note:"Solo, diluido. Mediodía intenso.", section:"cielos", tags:"cielo profundo mediodía" },
  { id:"m30", name:"Cielo Atardecer", result:"#d0a8b8", colors:["cer","po"], note:"Cerulean arriba, Orange abajo, húmedo sobre húmedo.", section:"cielos", tags:"cielo atardecer" },
  { id:"m31", name:"Cielo Nublado", result:"#788898", colors:["ub","bsl"], note:"Poco pigmento, mucha agua. Nubes = blanco del papel.", section:"cielos", tags:"cielo nubes nublado" },
  { id:"m32", name:"Cielo Nocturno", result:"#1a2040", colors:["ind","ub"], note:"Azul noche profundo. Toque de Pyrrol Red para calidez.", section:"cielos", tags:"cielo noche nocturno" },
  { id:"m33", name:"Cielo Tropical", result:"#68c8c8", colors:["ct"], note:"Solo, diluido. Aguas caribeñas.", section:"cielos", tags:"cielo tropical turquesa" },
  // Piel
  { id:"m34", name:"Piel Clara", result:"#e8c8a8", colors:["bt","qg"], note:"Base luminosa. Añade Pyrrol Red en mejillas.", section:"piel", tags:"piel clara retrato" },
  { id:"m35", name:"Piel Cálida", result:"#c8a078", colors:["rs","pr"], note:"Poquísimo rojo. Pieles mediterráneas.", section:"piel", tags:"piel cálida mediterránea" },
  { id:"m36", name:"Piel Rosada", result:"#d8b898", colors:["bt","po","cb"], note:"Toque mínimo de azul para neutralizar.", section:"piel", tags:"piel rosada" },
  { id:"m37", name:"Piel Oscura", result:"#886040", colors:["bsl","ub","pr"], note:"Varía proporciones según temperatura.", section:"piel", tags:"piel oscura" },
  { id:"m38", name:"Sombra Facial", result:"#a08870", colors:["rs","cb"], note:"Verde-gris suave para sombras faciales.", section:"piel", tags:"sombra piel cara" },
  // Arquitectura
  { id:"a1", name:"Piedra Caliza", result:"#b8a890", colors:["bt","rs"], note:"Muros claros. Buff granula y da textura natural.", section:"arquitectura", tags:"piedra caliza muro fachada" },
  { id:"a2", name:"Hormigón", result:"#8a8078", colors:["ub","bsl","bt"], note:"Gris granulado + Buff. Más azul = sombra, más sienna = sol.", section:"arquitectura", tags:"hormigón concreto gris" },
  { id:"a3", name:"Piedra Arenisca", result:"#c8b498", colors:["yo","bt"], note:"Arena cálida para fachadas de arenisca.", section:"arquitectura", tags:"arenisca arena piedra" },
  { id:"a4", name:"Piedra Vieja", result:"#686058", colors:["rs","ug"], note:"Piedra envejecida con manchas verdosas. Ruinas.", section:"arquitectura", tags:"piedra vieja musgo ruina" },
  { id:"a5", name:"Ladrillo Rojo", result:"#a04828", colors:["tro","bsl"], note:"Base para ladrillos. Varía cada uno para evitar monotonía.", section:"arquitectura", tags:"ladrillo rojo muro" },
  { id:"a6", name:"Ladrillo Claro", result:"#c87838", colors:["po","yo"], note:"Ladrillo anaranjado. Fachadas modernas o sol directo.", section:"arquitectura", tags:"ladrillo claro naranja" },
  { id:"a7", name:"Ladrillo Oscuro", result:"#683828", colors:["tro","ub"], note:"Ladrillo viejo. Sombras y edificios industriales.", section:"arquitectura", tags:"ladrillo oscuro industrial" },
  { id:"a8", name:"Mortero / Junta", result:"#d0a878", colors:["bt","rs","ub"], note:"Gris claro cálido. Pinta juntas primero, ladrillos después.", section:"arquitectura", tags:"mortero junta ladrillo" },
  { id:"a9", name:"Madera Clara", result:"#906838", colors:["rs","bsl"], note:"Pino, marcos. Vetas con más Burnt Sienna húmedo/húmedo.", section:"arquitectura", tags:"madera clara pino marco" },
  { id:"a10", name:"Madera Oscura", result:"#4a3018", colors:["bsl","ub","tro"], note:"Caoba, nogal, puertas antiguas.", section:"arquitectura", tags:"madera oscura puerta caoba" },
  { id:"a11", name:"Madera Envejecida", result:"#607848", colors:["sep","pgbs"], note:"Tono verdoso. Puertas viejas, bancos, madera de muelle.", section:"arquitectura", tags:"madera vieja envejecida verde" },
  { id:"a12", name:"Metal / Hierro", result:"#606878", colors:["pbgs","bsl"], note:"Gris frío. Rejas, barandillas. Deja brillos blancos.", section:"arquitectura", tags:"metal hierro reja barandilla" },
  { id:"a13", name:"Hierro Oxidado", result:"#884828", colors:["tro","po"], note:"Óxido vivo. Añade Ultramarine donde oscurece.", section:"arquitectura", tags:"óxido hierro oxidado" },
  { id:"a14", name:"Reflejo Vidrio", result:"#88a8c0", colors:["cer","rs"], note:"Ventanas reflejando cielo. Blancos para brillos.", section:"arquitectura", tags:"vidrio ventana reflejo cristal" },
  { id:"a15", name:"Ventana Oscura", result:"#384858", colors:["ind","bsl"], note:"Interior oscuro a través de cristal.", section:"arquitectura", tags:"ventana oscura interior" },
  { id:"a16", name:"Sombra Fría (muro)", result:"#585068", colors:["ub","mg"], note:"Sombra violácea en muros blancos. Moonglow granula.", section:"arquitectura", tags:"sombra fría muro blanco" },
  { id:"a17", name:"Sombra Cálida (piedra)", result:"#685848", colors:["ub","bsl","qg"], note:"Sombra con rebote cálido. Fachadas de piedra y adobe.", section:"arquitectura", tags:"sombra cálida piedra adobe" },
  { id:"a18", name:"Sombra Proyectada", result:"#484058", colors:["sv","ub"], note:"Sombras nítidas de cornisas, balcones y aleros.", section:"arquitectura", tags:"sombra proyectada cornisa balcón" },
  { id:"a19", name:"Sombra Profunda", result:"#282830", colors:["ind","sep"], note:"Bajo arcos, portones, pasajes. Una sola pasada valiente.", section:"arquitectura", tags:"sombra profunda arco portal" },
  { id:"a20", name:"Árbol Urbano (luz)", result:"#506838", colors:["pgbs","qg"], note:"Copa iluminada. Pinta suelto, los árboles enmarcan.", section:"arquitectura", tags:"árbol urbano verde luz" },
  { id:"a21", name:"Árbol Urbano (sombra)", result:"#2a3818", colors:["pgbs","pr"], note:"Copa oscura. Casi negro con matiz verde.", section:"arquitectura", tags:"árbol urbano sombra oscuro" },
  { id:"a22", name:"Enredadera / Hiedra", result:"#788048", colors:["ug","qg"], note:"Verde apagado sobre muros y balcones.", section:"arquitectura", tags:"enredadera hiedra balcón muro" },
  { id:"a23", name:"Acera", result:"#a09888", colors:["bt","jcg"], note:"Base neutra para aceras. Añade sombras después.", section:"arquitectura", tags:"acera pavimento suelo" },
  { id:"a24", name:"Adoquines", result:"#a09078", colors:["rs","jwg"], note:"Base cálida. Varía cada adoquín para textura.", section:"arquitectura", tags:"adoquín calle empedrado" },
  { id:"a25", name:"Asfalto Mojado", result:"#485060", colors:["pbgs","sep"], note:"Oscuro con reflejos. Blancos para charcos.", section:"arquitectura", tags:"asfalto mojado lluvia reflejo calle" },
  // Mezclas de artistas reconocidos
  // — Álvaro Castagnet (paleta DS: Ultramarine, Cobalt Blue, Yellow Ochre, Hansa Yellow Deep, Pyrrol Red, Deep Scarlet, Mayan Orange, Viridian, Burnt Sienna Light, Neutral Tint)
  { id:"r1", name:"Oscuros de Castagnet", result:"#1a1828", colors:["ub","bsl"], note:"Álvaro Castagnet: 'Burnt Sienna Light breaks down Ultramarine Blue perfectly.' Su mezcla estrella para crear oscuros dramáticos. Más azul = frío, más sienna = cálido.", section:"artistas", tags:"castagnet oscuro dramático ultramarine" },
  { id:"r2", name:"Gris Cálido Castagnet", result:"#786858", colors:["ub","bsl","pr"], note:"Castagnet añade Pyrrol Red a su mezcla de Ultramarine + Burnt Sienna Light para calidez en sombras de atardecer. Sus paisajes urbanos dependen de estos grises.", section:"artistas", tags:"castagnet gris cálido atardecer urbano" },
  { id:"r3", name:"Naranjas de Castagnet", result:"#d86028", colors:["po","pr"], note:"Castagnet adora los rojos y naranjas intensos. Pyrrol Red + Pyrrol Orange = naranja potente para acentos de luz cálida en escenas urbanas.", section:"artistas", tags:"castagnet naranja rojo intenso acento" },

  // — Joseph Zbukvic (paleta DS: Cadmium Yellow/Ochre, Burnt Sienna/Umber, Cadmium Red, Cobalt Blue, Ultramarine, Cobalt Turquoise + sus grises signature)
  { id:"r4", name:"Gris de Zbukvic (Cool)", result:"#788088", colors:["jcg","ub"], note:"Joseph Z's Cool Grey + Ultramarine. Zbukvic: 'Mezclo mis grises con casi cada color de mi paleta.' Su Cool Grey lleva luz de mañana y neblina.", section:"artistas", tags:"zbukvic gris frío cool grey neblina" },
  { id:"r5", name:"Gris de Zbukvic (Warm)", result:"#887868", colors:["jwg","bsl"], note:"Joseph Z's Warm Grey + Burnt Sienna Light. Perfecto para la luz de tarde que Zbukvic captura en sus escenas urbanas y marinas.", section:"artistas", tags:"zbukvic gris cálido warm grey tarde" },
  { id:"r6", name:"Cielo Zbukvic", result:"#90a8c0", colors:["cb","ct"], note:"Zbukvic usa Cobalt Blue + Cobalt Turquoise para cielos luminosos. Ambos granulan sutilmente. Diluidos dan la atmósfera característica de sus marinas.", section:"artistas", tags:"zbukvic cielo cobalt marina luminoso" },
  { id:"r7", name:"Sombra Marina Zbukvic", result:"#485060", colors:["ub","yo","bsl"], note:"Zbukvic: Ultramarine + Yellow Ochre + Burnt Sienna = gris verdoso para reflejos de agua y sombras portuarias. Su paleta limitada de 5 colores.", section:"artistas", tags:"zbukvic marina agua reflejo puerto sombra" },

  // — Pablo Rubén López Sanz (paleta DS: Opera Pink, Hansa Yellow Med, Phthalo Green BS, Cerulean Blue Chrom, Indigo, Sepia, Lavender, French Ultramarine, Transp Red Oxide, Pyrrol Red)
  { id:"r8", name:"Sombra Violácea P. Rubén", result:"#4a3858", colors:["ub","lav"], note:"Pablo Rubén usa Lavender + Ultramarine para sombras arquitectónicas con tono violáceo. Lavender aporta opacidad y granulación sutil a las sombras.", section:"artistas", tags:"pablo rubén sombra violeta lavender arquitectura" },
  { id:"r9", name:"Oscuro P. Rubén", result:"#181820", colors:["ind","sep"], note:"Pablo Rubén: Indigo + Sepia = los oscuros más profundos. Ambos están en su set oficial DS. Para portones, sombras bajo arcos y zonas de máximo contraste.", section:"artistas", tags:"pablo rubén oscuro indigo sepia portal arco" },
  { id:"r10", name:"Verde P. Rubén", result:"#386838", colors:["pgbs","yo"], note:"Phthalo Green BS + Yellow Ochre: verde apagado natural que Pablo Rubén usa para vegetación en sus paisajes arquitectónicos sin competir con los edificios.", section:"artistas", tags:"pablo rubén verde vegetación arquitectura" },
  { id:"r11", name:"Piedra Cálida P. Rubén", result:"#a08060", colors:["tro","rs"], note:"Transparent Red Oxide + Raw Sienna: tonos cálidos de piedra mediterránea. Pablo Rubén pinta paisajes de Madrid, Florencia y Lisboa con estas tierras.", section:"artistas", tags:"pablo rubén piedra cálida mediterráneo fachada" },
  { id:"r12", name:"Acento Rosa P. Rubén", result:"#e860a0", colors:["op","pr"], note:"Pablo Rubén incluye Opera Pink en su paleta DS para acentos florales y reflejos en fachadas. Opera Pink + Pyrrol Red = rosa-rojo vibrante para detalles.", section:"artistas", tags:"pablo rubén opera pink acento floral rosa" },

  // — Praful Sawant (paleta DS: New Gamboge, Pyrrol Orange, Ultramarine, Raw Sienna, Burnt Sienna Light, Undersea Green)
  { id:"r13", name:"Luz Dorada Sawant", result:"#d0a040", colors:["ng","rs"], note:"Praful Sawant: New Gamboge + Raw Sienna = luz dorada de India. Su paleta de solo 6 colores demuestra que menos es más. Perfecto para la hora dorada.", section:"artistas", tags:"sawant luz dorada india hora dorada new gamboge" },
  { id:"r14", name:"Sombra Sawant", result:"#3a3028", colors:["ub","bsl"], note:"Sawant: Ultramarine + Burnt Sienna Light es su mezcla principal de sombras. Con solo estos dos colores construye toda la estructura de valores.", section:"artistas", tags:"sawant sombra ultramarine burnt sienna valores" },
  { id:"r15", name:"Verde Sawant", result:"#3a5840", colors:["ug","ng"], note:"Sawant usa Undersea Green + New Gamboge para vegetación cálida. Undersea Green ya es una mezcla (Ultram. + Quin Gold), añadir Gamboge lo hace más vivo.", section:"artistas", tags:"sawant verde undersea vegetación cálido" },
  { id:"r16", name:"Naranja Intenso Sawant", result:"#e07020", colors:["po","ng"], note:"Praful Sawant: Pyrrol Orange + New Gamboge = naranja radiante. Lo usa para rickshaws, telas y mercados de India en plena luz.", section:"artistas", tags:"sawant naranja intenso india mercado luz" },
  { id:"r16b", name:"Oscuro Total Sawant", result:"#1a1818", colors:["ub","bsl","po"], note:"Sawant con solo 6 colores logra negros ricos: Ultramarine + Burnt Sienna Light + toque de Pyrrol Orange. El naranja calienta el negro y evita que sea muerto.", section:"artistas", tags:"sawant negro oscuro cálido pyrrol orange" },
  { id:"r16c", name:"Cielo Cálido Sawant", result:"#c8a870", colors:["ng","rs","ub"], note:"Sawant: New Gamboge + Raw Sienna con toque de Ultramarine para cielos al atardecer en India. El azul gris el amarillo sutilmente.", section:"artistas", tags:"sawant cielo atardecer cálido india" },
  { id:"r16d", name:"Verde Profundo Sawant", result:"#2a4030", colors:["ug","ub"], note:"Undersea Green + más Ultramarine = verde profundo y frío. Sawant lo usa para sombras en vegetación densa y árboles tropicales.", section:"artistas", tags:"sawant verde profundo sombra tropical" },

  // — Mezclas con Isoindolinone Yellow (PY110) — amarillo cálido transparente, casi naranja a masstone
  { id:"i1", name:"Naranja Dorado (Iso)", result:"#e09020", colors:["isy","pr"], note:"Isoindolinone Yellow + Pyrrol Red = naranja dorado intenso. Más cálido que con New Gamboge porque Iso ya tira a naranja. Atardeceres y hora dorada.", section:"naranjas", tags:"isoindolinone naranja dorado atardecer" },
  { id:"i2", name:"Verde Ácido Cálido", result:"#78a828", colors:["isy","pgbs"], note:"Iso Yellow + Phthalo Green BS = verde ácido pero más cálido que con Hansa. Para hojas bañadas en sol de tarde y vegetación iluminada.", section:"verdes", tags:"isoindolinone verde ácido cálido sol" },
  { id:"i3", name:"Verde Oliva Dorado", result:"#687030", colors:["isy","ub"], note:"Iso Yellow + Ultramarine = verde oliva con tono dorado. Más cálido y luminoso que con Quinacridone Gold. Campos de trigo, prados secos.", section:"verdes", tags:"isoindolinone verde oliva dorado trigo" },
  { id:"i4", name:"Tierra Dorada", result:"#b88838", colors:["isy","bsl"], note:"Iso Yellow + Burnt Sienna Light = tierra dorada rica. Perfecto para fachadas soleadas, arena mojada y piedra caliza con sol directo.", section:"tierras", tags:"isoindolinone tierra dorada fachada arena" },
  { id:"i5", name:"Sombra Oro Viejo", result:"#686028", colors:["isy","ub","bsl"], note:"Iso Yellow + Ultramarine + Burnt Sienna = sombra con tono de oro viejo. Para marcos dorados, detalles de iglesias y ornamentos en arquitectura.", section:"arquitectura", tags:"isoindolinone oro viejo ornamento iglesia" },
  { id:"i6", name:"Piel Dorada", result:"#d8a868", colors:["isy","tro"], note:"Iso Yellow + Transparent Red Oxide = tono piel dorado cálido. Más vibrante que Raw Sienna + Red para pieles bronceadas.", section:"piel", tags:"isoindolinone piel dorada bronceada" },
  { id:"i7", name:"Verde Primavera Cálido", result:"#58a830", colors:["isy","pbgs"], note:"Iso Yellow + Phthalo Blue GS = verde brillante con subtono cálido. Para hierba al sol y campos primaverales.", section:"verdes", tags:"isoindolinone verde primavera hierba campo" },
  { id:"i8", name:"Naranja Terracota", result:"#c07028", colors:["isy","tro"], note:"Iso Yellow + Transparent Red Oxide = naranja terroso, tipo terracota con luminosidad. Tejados al sol y cerámica artesanal.", section:"arquitectura", tags:"isoindolinone terracota tejado cerámica" },

  // — David Taylor (paisajista arquitectónico, paleta minimalista basada en transparentes y tierras)
  { id:"r17", name:"Cielo Limpio Taylor", result:"#88b8d8", colors:["cer","cb"], note:"David Taylor mezcla Cerulean + Cobalt para cielos graduados sobre edificios. Ambos granulan y se levantan, ideal para dejar blancos en nubes.", section:"artistas", tags:"taylor cielo cobalt cerulean paisaje" },
  { id:"r18", name:"Piedra Taylor", result:"#b0a088", colors:["rs","ub","bt"], note:"David Taylor: Raw Sienna + toque de Ultramarine + Buff Titanium para fachadas de piedra caliza. Buff da opacidad sutil que simula la piedra mate.", section:"artistas", tags:"taylor piedra caliza fachada buff" },
  { id:"r19", name:"Sombra Fría Taylor", result:"#505868", colors:["ub","ind"], note:"Taylor usa Ultramarine + Indigo para sombras frías en arquitectura. Sombras dramáticas y definidas que dan volumen a los edificios.", section:"artistas", tags:"taylor sombra fría arquitectura volumen" },

  // — Jane Blundell (cross-referenced mixes)
  { id:"r20", name:"Jane's Black", result:"#0e0e10", colors:["pgbs","pr"], note:"Mezcla insignia de Jane Blundell. Phthalo Green + rojo cálido = negro transparente riquísimo. Ahora color oficial de DS ('Jane's Black Red/Green').", section:"artistas", tags:"negro jane blundell transparente" },
  { id:"r21", name:"Jane's Grey", result:"#5a5058", colors:["ub","bsl"], note:"La mezcla más famosa de Jane Blundell, ahora color oficial de DS. Ultramarine + Burnt Sienna en partes casi iguales. Granulación espectacular.", section:"artistas", tags:"gris jane blundell granulado sombra" },
  { id:"r22", name:"Gris Polvo (Cerulean)", result:"#908888", colors:["cer","bsl"], note:"Jane Blundell: Cerulean + Burnt Sienna = grises polvorientos con granulación. Ideal para cielos y piedra. Dusty y levantable.", section:"artistas", tags:"gris polvo cerulean piedra cielo blundell" },
  { id:"r23", name:"Gris Tormentoso", result:"#485868", colors:["mg","pbgs"], note:"DS recomienda: Moonglow + Phthalo Blue GS = gris atmosférico granulante. Para cielos tormentosos y sombras dramáticas.", section:"artistas", tags:"gris tormentoso moonglow cielo tormenta" },
  { id:"r24", name:"Gris Cálido de Jan Min", result:"#8a7868", colors:["bsl","lav"], note:"Embajador DS Jan Min: Burnt Sienna + Lavender = gris cálido sofisticado con granulación. Para sombras, retratos y fondos.", section:"artistas", tags:"gris cálido jan min sombra retrato" },
  { id:"r25", name:"Moonglow Casero (lightfast)", result:"#584860", colors:["ub","pgbs","pr"], note:"Kimberly Crick recomienda mezclar tu Moonglow lightfast: Ultramarine + Phthalo Green + Pyrrol Red. Granula similar pero no se desvanece.", section:"artistas", tags:"moonglow casero lightfast permanente kimberly crick" },
];

const SECTIONS = [
  { id:"negros", label:"02", title:"Negros & Grises", icon:"◼" },
  { id:"verdes", label:"03", title:"Verdes", icon:"🌿" },
  { id:"naranjas", label:"04", title:"Naranjas", icon:"🔥" },
  { id:"violetas", label:"05", title:"Violetas", icon:"💜" },
  { id:"tierras", label:"06", title:"Tierras", icon:"🪨" },
  { id:"cielos", label:"07", title:"Cielos", icon:"☁️" },
  { id:"piel", label:"08", title:"Tonos Piel", icon:"👤" },
  { id:"arquitectura", label:"09", title:"Arquitectura", icon:"🏛️" },
  { id:"artistas", label:"10", title:"Recetas de Artistas", icon:"🎨" },
];

const PALETTE_SLOTS = [
  { row:0, col:0, id:"hym" }, { row:0, col:1, id:"isy" }, { row:0, col:2, id:"ng" }, { row:0, col:3, id:"yo" }, { row:0, col:4, id:"qg" }, { row:0, col:5, id:"rs" }, { row:0, col:6, id:"bt" },
  { row:1, col:0, id:"po" }, { row:1, col:1, id:"pr" }, { row:1, col:2, id:"op" }, { row:1, col:3, id:"tro" }, { row:1, col:4, id:"bsl" }, { row:1, col:5, id:"sep" },
  { row:2, col:0, id:"ub" }, { row:2, col:1, id:"pbgs" }, { row:2, col:2, id:"cb" }, { row:2, col:3, id:"cer" }, { row:2, col:4, id:"ct" }, { row:2, col:5, id:"ind" },
  { row:3, col:0, id:"pgbs" }, { row:3, col:1, id:"ug" }, { row:3, col:2, id:"lav" }, { row:3, col:3, id:"sv" }, { row:3, col:4, id:"mg" },
  { row:4, col:0, id:"jcg" }, { row:4, col:1, id:"jwg" }, { row:4, col:2, id:"lb" },
];

const ROW_LABELS = ["Amarillos & Tierras","Rojos & Naranjas","Azules","Verdes & Violetas","Neutros"];

const colorMap = {};
COLORS.forEach(c => colorMap[c.id] = c);

function getColorById(id) { return colorMap[id] || null; }

// Palette Mixer: find mixes involving both selected colors
function findMixes(sel) {
  if (sel.length === 0) return MIXES;
  if (sel.length === 1) return MIXES.filter(m => m.colors.includes(sel[0]));
  return MIXES.filter(m => sel.every(s => m.colors.includes(s)));
}

export default function App() {
  const [tab, setTab] = useState("guide"); // guide | mixer | palette
  const [search, setSearch] = useState("");
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage?.getItem?.("wc_favs") || "[]"); } catch { return []; }
  });
  const [collapsed, setCollapsed] = useState({});
  const [mixerSel, setMixerSel] = useState([]);
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [wheelSel, setWheelSel] = useState(null);

  // Color relationships: hue angle (0-360), complementary, analogous, triadic, split-comp, neutralizing pair
  const COLOR_REL = {
    hym: { hue:55, comp:["sv","mg","lav"], analogous:["isy","ng"], triadic:["pr","pbgs"], split:["ub","pgbs"], neutral:"sv", desc:"Amarillo primario medio. Ni cálido ni frío." },
    isy: { hue:48, comp:["sv","mg","lav"], analogous:["hym","ng"], triadic:["pr","cb"], split:["ub","pgbs"], neutral:"sv", desc:"Amarillo cálido profundo, casi naranja a masstone. Transparente." },
    ng: { hue:38, comp:["ub","cb"], analogous:["isy","po"], triadic:["op","pgbs"], split:["pbgs","lav"], neutral:"ub", desc:"Amarillo cálido anaranjado. Intenso y versátil." },
    yo: { hue:42, comp:["ub","cb"], analogous:["rs","ng"], triadic:["pr","pgbs"], split:["pbgs","sv"], neutral:"ub", desc:"Amarillo tierra, semi-opaco. Granulación suave." },
    qg: { hue:35, comp:["ub","sv"], analogous:["yo","tro"], triadic:["pr","cer"], split:["pbgs","lav"], neutral:"ub", desc:"Amarillo neutralizado cálido. Clave para verdes realistas." },
    rs: { hue:40, comp:["ub","cb"], analogous:["yo","qg"], triadic:["pr","pgbs"], split:["pbgs","sv"], neutral:"cb", desc:"Tierra amarilla cálida. Granulante." },
    bt: { hue:45, comp:[], analogous:[], triadic:[], split:[], neutral:"", desc:"Crema opaco granulante. No es un color de mezcla primaria sino un modificador." },
    po: { hue:22, comp:["pbgs","ct"], analogous:["pr","ng"], triadic:["pgbs","lav"], split:["ub","pgbs"], neutral:"pbgs", desc:"Naranja puro intenso. Complementario del azul." },
    pr: { hue:8, comp:["pgbs","ct"], analogous:["po","op"], triadic:["hym","ub"], split:["pbgs","cb"], neutral:"pgbs", desc:"Rojo cálido. Su complementario es Phthalo Green." },
    op: { hue:340, comp:["pgbs","ug"], analogous:["pr","lav"], triadic:["ng","cer"], split:["pgbs","ct"], neutral:"pgbs", desc:"Rosa fluorescente. ⚠️ No permanente. Mezcla vibrante pero efímera." },
    tro: { hue:18, comp:["pbgs","ub"], analogous:["bsl","pr"], triadic:["hym","pgbs"], split:["ub","pgbs"], neutral:"ub", desc:"Rojo tierra transparente. Granulación espectacular." },
    bsl: { hue:25, comp:["ub","pbgs"], analogous:["tro","yo"], triadic:["hym","pgbs"], split:["ub","cb"], neutral:"ub", desc:"Naranja tierra. Su par con Ultramarine = el gris más famoso." },
    sep: { hue:28, comp:["ub","pbgs"], analogous:["bsl","tro"], triadic:["yo","pgbs"], split:["ub","cb"], neutral:"ub", desc:"Marrón oscuro opaco. Útil para oscuros directos." },
    ub: { hue:240, comp:["ng","yo","bsl"], analogous:["pbgs","cb"], triadic:["pr","hym"], split:["po","qg"], neutral:"bsl", desc:"Azul cálido violáceo. El azul más versátil. Granulante." },
    pbgs: { hue:210, comp:["po","pr","tro"], analogous:["ub","cer"], triadic:["op","ng"], split:["pr","ng"], neutral:"pr", desc:"Azul frío verdoso. Potentísimo y staining." },
    cb: { hue:225, comp:["po","ng"], analogous:["ub","cer"], triadic:["pr","hym"], split:["po","qg"], neutral:"bsl", desc:"Azul medio puro. Granulante y levantable." },
    cer: { hue:200, comp:["po","tro"], analogous:["cb","ct"], triadic:["ng","op"], split:["pr","qg"], neutral:"bsl", desc:"Azul cielo opaco. Granulante y levantable. Ideal para cielos." },
    ct: { hue:185, comp:["pr","po"], analogous:["cer","pgbs"], triadic:["ng","lav"], split:["pr","op"], neutral:"pr", desc:"Turquesa opaco granulante. Aguas tropicales." },
    ind: { hue:225, comp:["po","ng"], analogous:["ub","pbgs"], triadic:["pr","hym"], split:["po","qg"], neutral:"bsl", desc:"Azul oscuro profundo. Mezcla de conveniencia." },
    pgbs: { hue:165, comp:["pr","op"], analogous:["ct","ug"], triadic:["ub","po"], split:["pr","tro"], neutral:"pr", desc:"Verde azulado potentísimo. Con rojos da negros." },
    ug: { hue:155, comp:["pr","op"], analogous:["pgbs","ct"], triadic:["ub","po"], split:["pr","tro"], neutral:"op", desc:"Verde apagado (Ultram.+Quin Gold). Mezcla de conveniencia." },
    lav: { hue:275, comp:["yo","qg"], analogous:["sv","mg"], triadic:["ng","pgbs"], split:["yo","ng"], neutral:"qg", desc:"Violeta claro opaco granulante. Mezcla de conveniencia." },
    sv: { hue:280, comp:["hym","isy"], analogous:["lav","mg"], triadic:["ng","pgbs"], split:["yo","ng"], neutral:"hym", desc:"Violeta sombra. Granula y separa pigmentos al secar." },
    mg: { hue:270, comp:["hym","isy"], analogous:["sv","lav"], triadic:["ng","pgbs"], split:["yo","ng"], neutral:"hym", desc:"Violeta misterioso. Granula y separa en 3 colores al secar." },
    jcg: { hue:0, comp:[], analogous:[], triadic:[], split:[], neutral:"", desc:"Gris neutro frío. Mezcla signature de Joseph Zbukvic." },
    jwg: { hue:0, comp:[], analogous:[], triadic:[], split:[], neutral:"", desc:"Gris neutro cálido. Mezcla signature de Joseph Zbukvic." },
    lb: { hue:0, comp:[], analogous:[], triadic:[], split:[], neutral:"", desc:"Negro granulante magnético. PBk11." },
  };

  const toggleFav = useCallback((id) => {
    setFavs(prev => {
      const next = prev.includes(id) ? prev.filter(f=>f!==id) : [...prev, id];
      try { localStorage?.setItem?.("wc_favs", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const toggleCollapse = (sid) => setCollapsed(p => ({...p, [sid]: !p[sid]}));

  const toggleMixer = (cid) => {
    setMixerSel(prev => {
      if (prev.includes(cid)) return prev.filter(x=>x!==cid);
      if (prev.length >= 3) return [prev[1], prev[2], cid];
      return [...prev, cid];
    });
  };

  const filteredMixes = useMemo(() => {
    let list = tab === "mixer" ? findMixes(mixerSel) : MIXES;
    if (showFavsOnly) list = list.filter(m => favs.includes(m.id));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.tags.includes(q) ||
        m.note.toLowerCase().includes(q) ||
        m.colors.some(c => getColorById(c)?.name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [tab, mixerSel, search, showFavsOnly, favs]);

  const groupedMixes = useMemo(() => {
    const g = {};
    SECTIONS.forEach(s => g[s.id] = []);
    filteredMixes.forEach(m => { if (g[m.section]) g[m.section].push(m); });
    return g;
  }, [filteredMixes]);

  return (
    <div style={{ background:"#0e0e11", minHeight:"100vh", color:"#e8e4df", fontFamily:"'Outfit',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:6px; height:6px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:3px; }
        input::placeholder { color:#5a554d; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign:"center", padding:"48px 20px 24px", position:"relative" }}>
        <div style={{ position:"absolute", top:"-100px", left:"50%", transform:"translateX(-50%)", width:500, height:500, background:"radial-gradient(circle, rgba(212,132,90,0.1) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ display:"inline-flex", padding:"5px 14px", border:"1px solid rgba(255,255,255,0.1)", borderRadius:100, fontSize:"0.65rem", fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"#d4845a", marginBottom:16, background:"rgba(212,132,90,0.06)" }}>
          ● Daniel Smith · 27 colores
        </div>
        <h1 style={{ fontFamily:"'Crimson Pro',serif", fontSize:"clamp(2rem,5vw,3.2rem)", fontWeight:700, color:"#fff", letterSpacing:-1, lineHeight:1.1 }}>
          Guía de <em style={{ color:"#d4845a" }}>Mezclas</em>
        </h1>
      </div>

      {/* Tab Bar */}
      <div style={{ display:"flex", justifyContent:"center", gap:4, padding:"0 20px 16px", flexWrap:"wrap" }}>
        {[["guide","📖 Guía"],["mixer","🎨 Mezclador"],["wheel","🔴 Rueda"],["palette","🗺️ Mi Paleta"]].map(([k,l]) => (
          <button key={k} onClick={()=>{ setTab(k); setSearch(""); setMixerSel([]); setWheelSel(null); }} style={{
            padding:"8px 18px", borderRadius:10, fontSize:"0.78rem", fontWeight:600, fontFamily:"inherit",
            border: tab===k ? "1px solid rgba(212,132,90,0.4)" : "1px solid rgba(255,255,255,0.06)",
            background: tab===k ? "rgba(212,132,90,0.12)" : "rgba(255,255,255,0.03)",
            color: tab===k ? "#d4845a" : "#8a857d", cursor:"pointer", transition:"all 0.2s"
          }}>{l}</button>
        ))}
      </div>

      <div style={{ maxWidth:1000, margin:"0 auto", padding:"0 16px" }}>

        {/* Search + Favs Filter */}
        {tab !== "palette" && (
          <div style={{ display:"flex", gap:8, marginBottom:20, alignItems:"center", flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:200, position:"relative" }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:"0.85rem", opacity:0.4 }}>🔍</span>
              <input
                value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Buscar mezcla, color o uso..."
                style={{
                  width:"100%", padding:"10px 12px 10px 36px", borderRadius:10, border:"1px solid rgba(255,255,255,0.08)",
                  background:"rgba(255,255,255,0.04)", color:"#e8e4df", fontSize:"0.82rem", fontFamily:"inherit", outline:"none"
                }}
              />
            </div>
            <button onClick={()=>setShowFavsOnly(p=>!p)} style={{
              padding:"10px 16px", borderRadius:10, fontSize:"0.78rem", fontWeight:600, fontFamily:"inherit", cursor:"pointer",
              border: showFavsOnly ? "1px solid rgba(232,180,80,0.4)" : "1px solid rgba(255,255,255,0.06)",
              background: showFavsOnly ? "rgba(232,180,80,0.12)" : "rgba(255,255,255,0.03)",
              color: showFavsOnly ? "#e8b450" : "#8a857d", transition:"all 0.2s"
            }}>★ Favoritos{showFavsOnly ? ` (${favs.length})` : ""}</button>
          </div>
        )}

        {/* MIXER TAB */}
        {tab === "mixer" && (
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:"0.82rem", color:"#8a857d", marginBottom:16, fontWeight:300 }}>
              Selecciona 2-3 colores de tu paleta para ver qué mezclas puedes hacer con ellos.
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:20 }}>
              {COLORS.map(c => {
                const sel = mixerSel.includes(c.id);
                return (
                  <button key={c.id} onClick={()=>toggleMixer(c.id)} style={{
                    display:"inline-flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:8,
                    fontSize:"0.72rem", fontWeight:500, fontFamily:"inherit", cursor:"pointer", transition:"all 0.2s",
                    border: sel ? "1px solid rgba(212,132,90,0.5)" : "1px solid rgba(255,255,255,0.06)",
                    background: sel ? "rgba(212,132,90,0.15)" : "rgba(255,255,255,0.03)",
                    color: sel ? "#fff" : "#8a857d",
                  }}>
                    <span style={{ width:14, height:14, borderRadius:4, background:c.hex, display:"inline-block", boxShadow:"0 1px 3px rgba(0,0,0,0.3)", border: c.hex==="#282828"?"1px solid rgba(255,255,255,0.15)":"none" }} />
                    {c.name}
                  </button>
                );
              })}
            </div>
            {mixerSel.length > 0 && (
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:16, flexWrap:"wrap" }}>
                <span style={{ fontSize:"0.72rem", color:"#8a857d", fontWeight:600, textTransform:"uppercase", letterSpacing:1.5 }}>Selección:</span>
                {mixerSel.map(id => {
                  const c = getColorById(id);
                  return (
                    <span key={id} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 11px", borderRadius:8, background:"rgba(212,132,90,0.1)", border:"1px solid rgba(212,132,90,0.2)", fontSize:"0.75rem", color:"#d4845a", fontWeight:500 }}>
                      <span style={{ width:12, height:12, borderRadius:3, background:c.hex, boxShadow:"0 1px 3px rgba(0,0,0,0.3)" }} />
                      {c.name}
                    </span>
                  );
                })}
                <button onClick={()=>setMixerSel([])} style={{ padding:"4px 10px", borderRadius:6, fontSize:"0.68rem", border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#8a857d", cursor:"pointer", fontFamily:"inherit" }}>Limpiar</button>
              </div>
            )}
            <p style={{ fontSize:"0.88rem", fontWeight:600, color:"#fff" }}>
              {filteredMixes.length} mezcla{filteredMixes.length!==1?"s":""} encontrada{filteredMixes.length!==1?"s":""}
            </p>
          </div>
        )}

        {/* COLOR WHEEL TAB */}
        {tab === "wheel" && (
          <div style={{ marginBottom:32 }}>
            <p style={{ fontSize:"0.82rem", color:"#8a857d", marginBottom:20, fontWeight:300 }}>
              Tus 27 colores en la rueda cromática. Toca uno para ver complementarios, análogos y tríadas.
            </p>
            <div style={{ display:"flex", gap:24, flexWrap:"wrap", justifyContent:"center", alignItems:"flex-start" }}>
              {/* SVG Wheel */}
              <div style={{ flexShrink:0 }}>
                <svg viewBox="0 0 320 320" width="320" height="320">
                  {Array.from({length:120},(_,i)=>i*3).map(deg=>(
                    <line key={deg} x1={160+118*Math.cos((deg-90)*Math.PI/180)} y1={160+118*Math.sin((deg-90)*Math.PI/180)} x2={160+138*Math.cos((deg-90)*Math.PI/180)} y2={160+138*Math.sin((deg-90)*Math.PI/180)} stroke={`hsl(${deg},65%,45%)`} strokeWidth="3.5" opacity="0.2" />
                  ))}
                  <text x="160" y="158" textAnchor="middle" fill="#5a554d" fontSize="8" fontWeight="600" letterSpacing="1.5">RUEDA CROMÁTICA</text>
                  {wheelSel && COLOR_REL[wheelSel]?.comp?.map(cid => {
                    const rel2 = COLOR_REL[cid];
                    const rel1 = COLOR_REL[wheelSel];
                    if (!rel2?.hue || !rel1?.hue) return null;
                    return <line key={cid} x1={160+95*Math.cos((rel1.hue-90)*Math.PI/180)} y1={160+95*Math.sin((rel1.hue-90)*Math.PI/180)} x2={160+95*Math.cos((rel2.hue-90)*Math.PI/180)} y2={160+95*Math.sin((rel2.hue-90)*Math.PI/180)} stroke="rgba(232,112,88,0.35)" strokeWidth="1.5" strokeDasharray="4,4" />;
                  })}
                  {COLORS.filter(c=>COLOR_REL[c.id]?.hue>0).map(c=>{
                    const rel=COLOR_REL[c.id]; const a=(rel.hue-90)*Math.PI/180; const cx=160+98*Math.cos(a); const cy=160+98*Math.sin(a);
                    const isSel=wheelSel===c.id; const isComp=wheelSel&&COLOR_REL[wheelSel]?.comp?.includes(c.id);
                    const isAnalog=wheelSel&&COLOR_REL[wheelSel]?.analogous?.includes(c.id);
                    const isTriad=wheelSel&&COLOR_REL[wheelSel]?.triadic?.includes(c.id);
                    const dimmed=wheelSel&&!isSel&&!isComp&&!isAnalog&&!isTriad;
                    return (<g key={c.id} onClick={()=>setWheelSel(wheelSel===c.id?null:c.id)} style={{cursor:"pointer"}}>
                      {isSel&&<circle cx={cx} cy={cy} r="17" fill="none" stroke="#d4845a" strokeWidth="2" opacity="0.7"/>}
                      {isComp&&<circle cx={cx} cy={cy} r="16" fill="none" stroke="#e87058" strokeWidth="1.5" strokeDasharray="3,3"/>}
                      {isAnalog&&<circle cx={cx} cy={cy} r="16" fill="none" stroke="#7ab5a0" strokeWidth="1.5"/>}
                      {isTriad&&<circle cx={cx} cy={cy} r="16" fill="none" stroke="#b08ad4" strokeWidth="1.5" strokeDasharray="6,3"/>}
                      <circle cx={cx} cy={cy} r="11" fill={c.hex} stroke={isSel?"#fff":"rgba(255,255,255,0.15)"} strokeWidth={isSel?2:1} opacity={dimmed?0.2:1}/>
                    </g>);
                  })}
                  {COLORS.filter(c=>!COLOR_REL[c.id]?.hue).map((c,i)=>{
                    const isSel=wheelSel===c.id;
                    return <circle key={c.id} cx={138+i*22} cy={195} r="8" fill={c.hex} stroke={isSel?"#d4845a":"rgba(255,255,255,0.1)"} strokeWidth={isSel?2:1} onClick={()=>setWheelSel(wheelSel===c.id?null:c.id)} style={{cursor:"pointer"}}/>;
                  })}
                </svg>
                <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:8,flexWrap:"wrap"}}>
                  {[["#e87058","Complementario"],["#7ab5a0","Análogo"],["#b08ad4","Tríada"]].map(([co,l])=>(
                    <span key={l} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:"0.6rem",color:"#8a857d"}}>
                      <span style={{width:8,height:8,borderRadius:"50%",border:`2px solid ${co}`,display:"inline-block"}}/>{l}
                    </span>
                  ))}
                </div>
              </div>
              {/* Detail Panel */}
              <div style={{flex:1,minWidth:260}}>
                {!wheelSel?(
                  <div style={{padding:"50px 20px",textAlign:"center",color:"#5a554d"}}>
                    <p style={{fontSize:"1rem",marginBottom:6}}>← Toca un color en la rueda</p>
                    <p style={{fontSize:"0.78rem",fontWeight:300}}>Verás sus relaciones cromáticas y mezclas.</p>
                  </div>
                ):(()=>{
                  const c=getColorById(wheelSel); const rel=COLOR_REL[wheelSel];
                  if(!c||!rel) return null;
                  const secs=[
                    {label:"Complementarios",desc:"Opuestos en la rueda. Mezclados = grises/neutros.",ids:rel.comp,clr:"#e87058"},
                    {label:"Análogos",desc:"Vecinos. Mezclas armónicas y naturales.",ids:rel.analogous,clr:"#7ab5a0"},
                    {label:"Tríada",desc:"Equidistantes (120°). Equilibrio vibrante.",ids:rel.triadic,clr:"#b08ad4"},
                    {label:"Split Complementario",desc:"Los vecinos del complementario.",ids:rel.split,clr:"#d4a850"},
                  ];
                  const neu=rel.neutral?getColorById(rel.neutral):null;
                  return (<div>
                    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16,padding:16,background:"#18181d",borderRadius:14,border:"1px solid rgba(255,255,255,0.06)"}}>
                      <div style={{width:48,height:48,borderRadius:12,background:c.hex,boxShadow:"0 2px 12px rgba(0,0,0,0.4)",flexShrink:0,border:c.hex==="#282828"?"1px solid rgba(255,255,255,0.15)":"none"}}/>
                      <div>
                        <div style={{fontFamily:"'Crimson Pro',serif",fontSize:"1.2rem",fontWeight:700,color:"#fff"}}>{c.name}</div>
                        <div style={{fontSize:"0.7rem",color:"#8a857d"}}>{c.pigment}{rel.hue>0?` · Hue ${rel.hue}°`:""}</div>
                        <div style={{fontSize:"0.75rem",color:"#b0a898",marginTop:4,fontWeight:300}}>{rel.desc}</div>
                      </div>
                    </div>
                    {neu&&(<div style={{padding:14,background:"rgba(212,132,90,0.06)",border:"1px solid rgba(212,132,90,0.12)",borderRadius:12,marginBottom:14}}>
                      <div style={{fontSize:"0.6rem",fontWeight:700,textTransform:"uppercase",letterSpacing:2,color:"#d4845a",marginBottom:8}}>Par neutralizante → Grises</div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{width:20,height:20,borderRadius:6,background:c.hex,boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
                        <span style={{fontSize:"0.8rem",color:"#8a857d",fontWeight:600}}>+</span>
                        <span style={{width:20,height:20,borderRadius:6,background:neu.hex,boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
                        <span style={{fontSize:"0.78rem",fontWeight:500,color:"#e8e4df"}}>{neu.name}</span>
                        <span style={{fontSize:"0.68rem",color:"#8a857d",marginLeft:"auto"}}>= gris/negro</span>
                      </div>
                    </div>)}
                    {secs.map(s=>{
                      if(!s.ids||s.ids.length===0) return null;
                      return (<div key={s.label} style={{marginBottom:12}}>
                        <div style={{fontSize:"0.6rem",fontWeight:700,textTransform:"uppercase",letterSpacing:2,color:s.clr,marginBottom:6}}>{s.label}</div>
                        <div style={{fontSize:"0.66rem",color:"#5a554d",marginBottom:8,fontWeight:300}}>{s.desc}</div>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                          {s.ids.map(id=>{const rc=getColorById(id);if(!rc)return null;
                            return (<button key={id} onClick={()=>setWheelSel(id)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:`1px solid ${s.clr}33`,fontSize:"0.72rem",fontWeight:500,color:"#e8e4df",cursor:"pointer",fontFamily:"inherit"}}>
                              <span style={{width:14,height:14,borderRadius:4,background:rc.hex,boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}/>
                              {rc.name}
                            </button>);
                          })}
                        </div>
                      </div>);
                    })}
                    <div style={{marginTop:16}}>
                      <div style={{fontSize:"0.6rem",fontWeight:700,textTransform:"uppercase",letterSpacing:2,color:"#d4845a",marginBottom:8}}>Mezclas con este color ({MIXES.filter(m=>m.colors.includes(wheelSel)).length})</div>
                      <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:280,overflowY:"auto"}}>
                        {MIXES.filter(m=>m.colors.includes(wheelSel)).map(mix=>(<div key={mix.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"#18181d",borderRadius:10,border:"1px solid rgba(255,255,255,0.04)"}}>
                          <div style={{width:22,height:22,borderRadius:6,background:mix.result,flexShrink:0,boxShadow:"0 1px 4px rgba(0,0,0,0.3)",border:["#0a0a08","#181828","#282830","#1a2040","#0e0e10","#101018","#1a1818"].includes(mix.result)?"1px solid rgba(255,255,255,0.1)":"none"}}/>
                          <div style={{flex:1}}>
                            <div style={{fontSize:"0.78rem",fontWeight:600,color:"#fff"}}>{mix.name}</div>
                            <div style={{fontSize:"0.63rem",color:"#5a554d"}}>{mix.colors.map(id=>getColorById(id)?.name).filter(Boolean).join(" + ")}</div>
                          </div>
                        </div>))}
                        {MIXES.filter(m=>m.colors.includes(wheelSel)).length===0&&<p style={{fontSize:"0.78rem",color:"#5a554d",padding:12}}>No hay mezclas registradas con este color.</p>}
                      </div>
                    </div>
                  </div>);
                })()}
              </div>
            </div>
          </div>
        )}

        {/* PALETTE TAB */}
        {tab === "palette" && (
          <div style={{ marginBottom:32 }}>
            <p style={{ fontSize:"0.82rem", color:"#8a857d", marginBottom:20, fontWeight:300 }}>
              Distribución visual de tu paleta. Toca un color para ver sus mezclas en el mezclador.
            </p>
            {/* Palette box */}
            <div style={{ background:"#1a1a1f", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:28, maxWidth:600, margin:"0 auto" }}>
              {/* Mixing area */}
              <div style={{ background:"#22222a", borderRadius:12, height:64, marginBottom:24, display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize:"0.72rem", color:"#5a554d", fontWeight:500, letterSpacing:1, textTransform:"uppercase" }}>Zona de mezclas</span>
              </div>
              {/* Wells */}
              {[0,1,2,3,4].map(row => {
                const slots = PALETTE_SLOTS.filter(s => s.row === row);
                return (
                  <div key={row} style={{ marginBottom: row<4 ? 8 : 0 }}>
                    <div style={{ fontSize:"0.58rem", color:"#5a554d", fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", marginBottom:6, paddingLeft:4 }}>
                      {ROW_LABELS[row]}
                    </div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {slots.map(slot => {
                        const c = getColorById(slot.id);
                        return (
                          <button key={slot.id} onClick={()=>{ setTab("mixer"); setMixerSel([slot.id]); }}
                            title={c.name}
                            style={{
                              width:56, height:56, borderRadius:10, background:c.hex, border:"2px solid rgba(255,255,255,0.06)",
                              cursor:"pointer", position:"relative", transition:"all 0.2s", boxShadow:"0 2px 8px rgba(0,0,0,0.3)",
                              display:"flex", alignItems:"flex-end", justifyContent:"center", padding:3,
                            }}
                            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,0.5)"; }}
                            onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.3)"; }}
                          >
                            <span style={{
                              fontSize:"0.48rem", fontWeight:700, color: ["#f5e24d","#e8c82a","#e8a517","#c9982a","#c4892a","#c89848","#e8dcc0","#e85c1a","#ff3ca0","#e87820","#68c8c8","#a8c8e0","#5898c0","#9878b0","#8a8880","#988878","#b8a060"].includes(c.hex) ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.7)",
                              textAlign:"center", lineHeight:1.1, textShadow: ["#f5e24d","#e8c82a","#e8dcc0","#ff3ca0"].includes(c.hex) ? "none" : "0 1px 2px rgba(0,0,0,0.5)"
                            }}>
                              {c.name.split(" ").slice(0,2).join(" ")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <p style={{ textAlign:"center", fontSize:"0.72rem", color:"#5a554d", marginTop:12, fontWeight:300 }}>
              Toca cualquier color para saltar al mezclador con ese color seleccionado
            </p>
          </div>
        )}

        {/* MIXES LIST (Guide & Mixer) */}
        {tab !== "palette" && SECTIONS.map(sec => {
          const mixes = groupedMixes[sec.id];
          if (!mixes || mixes.length === 0) return null;
          const isCollapsed = collapsed[sec.id];
          return (
            <div key={sec.id} style={{ marginBottom:12 }}>
              <button onClick={()=>toggleCollapse(sec.id)} style={{
                width:"100%", display:"flex", alignItems:"center", gap:12, padding:"16px 4px",
                background:"transparent", border:"none", borderBottom:"1px solid rgba(255,255,255,0.06)",
                cursor:"pointer", fontFamily:"inherit", textAlign:"left"
              }}>
                <span style={{ fontSize:"0.58rem", fontWeight:700, letterSpacing:2.5, color:"#d4845a", textTransform:"uppercase", minWidth:24 }}>{sec.label}</span>
                <span style={{ fontFamily:"'Crimson Pro',serif", fontSize:"1.3rem", fontWeight:700, color:"#fff", flex:1 }}>{sec.title}</span>
                <span style={{ fontSize:"0.72rem", color:"#5a554d", marginRight:4 }}>{mixes.length}</span>
                <span style={{ fontSize:"0.85rem", color:"#5a554d", transform: isCollapsed ? "rotate(-90deg)" : "rotate(0)", transition:"transform 0.2s" }}>▼</span>
              </button>
              {!isCollapsed && (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:10, padding:"16px 0" }}>
                  {mixes.map(mix => (
                    <MixCard key={mix.id} mix={mix} isFav={favs.includes(mix.id)} onToggleFav={()=>toggleFav(mix.id)} />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {tab !== "palette" && filteredMixes.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:"#5a554d" }}>
            <p style={{ fontSize:"1.2rem", marginBottom:8 }}>Sin resultados</p>
            <p style={{ fontSize:"0.82rem", fontWeight:300 }}>Prueba con otra búsqueda o selección de colores.</p>
          </div>
        )}

        {/* Shopping */}
        {tab === "guide" && !search && !showFavsOnly && (
          <div style={{ marginTop:32, marginBottom:32 }}>
            <div style={{ borderBottom:"1px solid rgba(255,255,255,0.06)", paddingBottom:16, marginBottom:20 }}>
              <span style={{ fontSize:"0.58rem", fontWeight:700, letterSpacing:2.5, color:"#d4845a", textTransform:"uppercase" }}>11 — Siguiente paso</span>
              <h2 style={{ fontFamily:"'Crimson Pro',serif", fontSize:"1.5rem", fontWeight:700, color:"#fff", marginTop:6 }}>¿Qué Comprar?</h2>
            </div>
            <div style={{ background:"#18181d", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:24 }}>
              {[
                { p:"high", name:"Quinacridone Rose (PV19)", reason:"Rojo frío permanente. Violetas puros sin Opera Pink. Con Ultramarine = mejores púrpuras." },
                { p:"med", name:"Pyrrol Crimson (PR264)", reason:"Rojo profundo carmín. Oscuros ricos con Phthalo Green." },
                { p:"med", name:"Goethite (PY43)", reason:"Amarillo tierra con granulación mágica. Piedras y edificios." },
              ].map((item,i) => (
                <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", padding:"14px 0", borderBottom: i<2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <span style={{
                    fontSize:"0.55rem", fontWeight:700, textTransform:"uppercase", letterSpacing:1.2, padding:"4px 10px", borderRadius:6, flexShrink:0, marginTop:2,
                    background: item.p==="high" ? "rgba(212,90,70,0.2)" : "rgba(212,168,80,0.15)",
                    color: item.p==="high" ? "#e87058" : "#d4a850",
                    border: `1px solid ${item.p==="high" ? "rgba(212,90,70,0.2)" : "rgba(212,168,80,0.15)"}`,
                  }}>{item.p==="high"?"Esencial":"Útil"}</span>
                  <div>
                    <div style={{ fontWeight:600, fontSize:"0.88rem", color:"#fff", marginBottom:2 }}>{item.name}</div>
                    <div style={{ fontSize:"0.76rem", color:"#8a857d", fontWeight:300, lineHeight:1.6 }}>{item.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <div style={{ textAlign:"center", padding:"48px 24px", color:"#5a554d", fontSize:"0.68rem", borderTop:"1px solid rgba(255,255,255,0.04)", marginTop:40 }}>
        <em style={{ fontFamily:"'Crimson Pro',serif", fontStyle:"italic", fontSize:"0.82rem", color:"#d4845a" }}>Guía de Mezclas</em>
        {" "}· Daniel Smith · 27 colores · Santi
      </div>
    </div>
  );
}

function MixCard({ mix, isFav, onToggleFav }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{
        background: hovered ? "#1e1e25" : "#18181d",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)"}`,
        borderRadius:16, padding:20, transition:"all 0.25s", position:"relative", overflow:"hidden",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.3)" : "none"
      }}
    >
      {/* Top accent line */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg, #d4845a, transparent)", opacity: hovered ? 1 : 0, transition:"opacity 0.3s" }} />

      {/* Fav button */}
      <button onClick={onToggleFav} style={{
        position:"absolute", top:12, right:12, background:"transparent", border:"none", cursor:"pointer",
        fontSize:"1rem", opacity: isFav ? 1 : 0.25, transition:"opacity 0.2s", padding:4,
        filter: isFav ? "drop-shadow(0 0 4px rgba(232,180,80,0.4))" : "none"
      }}>
        {isFav ? "★" : "☆"}
      </button>

      {/* Result */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14, paddingRight:28 }}>
        <div style={{
          width:36, height:36, borderRadius:10, background:mix.result, flexShrink:0,
          boxShadow:"0 2px 10px rgba(0,0,0,0.4)",
          border: ["#0a0a08","#181828","#282830","#1a2040","#282830"].includes(mix.result) ? "1px solid rgba(255,255,255,0.1)" : "none"
        }} />
        <div>
          <span style={{ fontFamily:"'Crimson Pro',serif", fontSize:"1.1rem", fontWeight:600, color:"#fff" }}>{mix.name}</span>
          {mix.warn && <span style={{ marginLeft:8, fontSize:"0.55rem", fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"#e8a040", background:"rgba(232,160,64,0.12)", padding:"2px 7px", borderRadius:4 }}>No permanente</span>}
        </div>
      </div>

      {/* Formula */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14, flexWrap:"wrap" }}>
        {mix.colors.map((cid, i) => {
          const c = getColorById(cid);
          if (!c) return null;
          return (
            <React.Fragment key={cid}>
              {i > 0 && <span style={{ fontSize:"0.8rem", color:"#5a554d", fontWeight:600 }}>+</span>}
              <span style={{
                display:"inline-flex", alignItems:"center", gap:6, fontSize:"0.72rem", fontWeight:500,
                padding:"5px 11px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)",
                borderRadius:8, color:"#e8e4df"
              }}>
                <span style={{ width:12, height:12, borderRadius:4, background:c.hex, boxShadow:"0 1px 3px rgba(0,0,0,0.3)", border: c.hex==="#282828"?"1px solid rgba(255,255,255,0.15)":"none" }} />
                {c.name}
              </span>
            </React.Fragment>
          );
        })}
      </div>

      {/* Note */}
      <div style={{ fontSize:"0.76rem", color:"#8a857d", lineHeight:1.6, paddingTop:12, borderTop:"1px solid rgba(255,255,255,0.06)", fontWeight:300 }}>
        {mix.note}
      </div>
    </div>
  );
}
