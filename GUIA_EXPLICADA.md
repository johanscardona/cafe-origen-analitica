# Guía explicada: Café Origen Analítica v0.1

Esta guía explica, archivo por archivo, **qué hace cada línea y por qué existe cada variable**. Léela con el código abierto al lado.

> **Importante sobre los datos:** de tu tabla solo pude ver 3 filas (las de tu captura). Las filas 4 a 12 de `datos.js` son de ejemplo, diseñadas para que el total dé 985.000 y para incluir los casos borde que pide el reto. **Reemplázalas por las filas reales de tu tabla.** Todo el código funciona igual con tus datos.

---

## 0. Conceptos que usarás en todo el proyecto

| Concepto | Qué es | Ejemplo |
| --- | --- | --- |
| Variable | Una caja con nombre donde guardas un valor | `let total = 0` |
| `const` | Variable que no se puede reasignar | `const ventas = [...]` |
| `let` | Variable que sí cambia durante el programa | `let total = 0; total += 5` |
| Arreglo | Lista ordenada de valores; se accede por posición desde 0 | `ventas[0]` es el primero |
| Objeto | Conjunto de pares `clave: valor` | `{ id: 1, cliente: "C01" }` |
| Función | Bloque reutilizable que recibe parámetros y devuelve un resultado | `valorVenta(venta)` |
| `module.exports` / `require` | Forma de compartir código entre archivos | `require("./datos")` |

**Por qué `const` para casi todo:** si una variable no necesita cambiar, `const` evita que la cambies por accidente. Usamos `let` solo cuando el valor se va actualizando (contadores, acumuladores).

---

## 1. `src/datos.js`

```js
const ventas = [
  { id: 1, cliente: "C01", producto: "Origen Huila 500 g", ciudad: "Medellin", cantidad: 2, precio: 42000 },
  ...
];

module.exports = ventas;
```

| Línea | Qué hace | Por qué |
| --- | --- | --- |
| `const ventas = [` | Crea una variable llamada `ventas` que contiene un arreglo (los corchetes `[ ]`) | El reto pide un arreglo de objetos llamado `ventas`. `const` porque la lista no se reasigna |
| `{ id: 1, ... }` | Cada llave `{ }` es un objeto: una venta | Cada venta tiene varias propiedades, así que un objeto las agrupa |
| `id` | Número único de la venta | Permite identificar cada registro (por ejemplo, cuál fue la venta mayor) |
| `cliente` | Texto con el código del cliente | Es texto porque tiene letras ("C01"). Un número no podría guardar la "C" |
| `producto` | Texto con el nombre del producto | Texto descriptivo |
| `ciudad` | Texto con la ciudad | Texto. Algunas vienen con errores (espacios, tildes) a propósito |
| `cantidad` | Número de unidades | Número (sin comillas) para poder multiplicar |
| `precio` | Precio por unidad en pesos | Número sin puntos ni símbolo: `42000`, no `"42.000"`. Los puntos de miles son solo formato visual |
| Coma al final de cada objeto | Separa un elemento del siguiente | Sin la coma salía el error rojo `',' expected` que viste |
| `module.exports = ventas;` | Hace que otros archivos puedan importar este arreglo | Sin esto, `explorar.js` no podría usar los datos. Antes tenías `GPUShaderModule` por error del autocompletado |

**Por qué se dejan los errores en los datos:** el reto dice que la limpieza debe ser una decisión tuya, no un accidente. Por eso `datos.js` guarda los datos "sucios" y el código los limpia al momento de calcular.

---

## 2. `src/explorar.js`

```js
const ventas = require("./datos");
```
- `require("./datos")` busca el archivo `datos.js` en la misma carpeta (`./` significa "aquí") y trae lo que ese archivo exportó.
- Se guarda en `const ventas`. Se llama igual que en `datos.js` para que sea fácil seguirlo.

```js
console.log("Cantidad de registros:", ventas.length);
```
- `console.log` escribe en la terminal.
- `ventas.length` es la cantidad de elementos del arreglo (12). `length` es una propiedad, no una función, por eso no lleva paréntesis.

```js
console.log("Primer registro:", ventas[0]);
```
- Los arreglos empiezan a contarse en **0**, así que el primero es `ventas[0]`.

```js
console.log("Último registro:", ventas[ventas.length - 1]);
```
- Si hay 12 elementos, las posiciones van de 0 a 11. El último está en `length - 1`.
- Usar `length - 1` (en vez de escribir `11`) hace que el código siga funcionando si agregas más ventas.

```js
console.log("Producto del registro en la posición 4:", ventas[4].producto);
```
- `ventas[4]` es el **quinto** registro (posición 4 contando desde 0). Con `.producto` se toma solo esa propiedad.

```js
console.table(ventas);
```
- `console.table` dibuja el arreglo de objetos como tabla: cada objeto es una fila y cada propiedad una columna. Sirve para revisar los datos a simple vista y descubrir los casos borde.

---

## 3. `src/analitica.js`

### 3.1 Utilidades

```js
function normalizarTexto(texto) {
  if (typeof texto !== "string") {
    return "";
  }
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}
```

| Línea | Qué hace | Por qué |
| --- | --- | --- |
| `function normalizarTexto(texto)` | Declara una función con un parámetro `texto` | Un parámetro es el dato de entrada. Una sola función de limpieza se reutiliza en ciudades y productos |
| `typeof texto !== "string"` | Comprueba si el dato NO es texto | Si llegara `null` o un número, `trim()` fallaría y el programa se caería |
| `return "";` | Devuelve texto vacío en ese caso | Así la función nunca se rompe |
| `.trim()` | Quita espacios al inicio y al final | Arregla `"Bogotá "` |
| `.toLowerCase()` | Pasa todo a minúsculas | `"MEDELLÍN"` y `"Medellín"` pasan a ser iguales |
| `.normalize("NFD")` | Separa cada letra de su tilde: `í` pasa a `i` + tilde | Prepara el texto para quitar tildes |
| `.replace(/[̀-ͯ]/g, "")` | Borra los caracteres de tilde | `"Medellin"` y `"Medellín"` quedan idénticos. Sin esto saldrían 5 ciudades en vez de 4 |

```js
function nombreCiudad(ciudad) {
  const conocidas = { medellin: "Medellín", bogota: "Bogotá", cali: "Cali", pereira: "Pereira" };
  const clave = normalizarTexto(ciudad);
  return conocidas[clave] || ciudad.trim();
}
```
- `conocidas` es un objeto usado como **diccionario**: clave normalizada a nombre bonito para mostrar.
- `clave` es la ciudad normalizada, que se usa para buscar en el diccionario.
- `conocidas[clave]` busca el nombre bonito. Si no existe devuelve `undefined`, y entonces `||` ("o") usa `ciudad.trim()` como respaldo.
- `conocidas` está dentro de la función (no es global), cumpliendo el requisito de no usar variables globales.

### 3.2 MiniReto 2: ciclos

```js
function valorVenta(venta) {
  return venta.cantidad * venta.precio;
}
```
- Recibe **una** venta y devuelve cuánto dinero representa. Todas las demás funciones la reutilizan: si algún día cambia la regla (descuentos, por ejemplo), solo la cambias aquí.

```js
function totalVendido(ventas) {
  let total = 0;
  for (const venta of ventas) {
    total += valorVenta(venta);
  }
  return total;
}
```

| Línea | Qué hace | Por qué |
| --- | --- | --- |
| `function totalVendido(ventas)` | El arreglo entra como parámetro | Sin variables globales; funciona con cualquier arreglo |
| `let total = 0;` | **Acumulador**, empieza en 0 | Empieza en 0 porque es el valor neutro de la suma. Es `let` porque cambia |
| `for (const venta of ventas)` | Recorre el arreglo; en cada vuelta `venta` es una venta distinta | `const` porque dentro de una vuelta `venta` no se reasigna |
| `total += valorVenta(venta);` | Equivale a `total = total + valorVenta(venta)` | Va sumando el valor de cada venta |
| `return total;` | Devuelve el resultado | Con `[]` el ciclo no corre y devuelve 0, sin errores |

```js
function unidadesVendidas(ventas) {
  let unidades = 0;
  for (const venta of ventas) {
    unidades += venta.cantidad;
  }
  return unidades;
}
```
- Mismo patrón acumulador, pero suma `cantidad` y no el dinero. `unidades` guarda cuántas unidades van.

```js
function ventaMayor(ventas) {
  let mayor = null;
  for (const venta of ventas) {
    if (mayor === null || valorVenta(venta) > valorVenta(mayor)) {
      mayor = venta;
    }
  }
  return mayor;
}
```
- Patrón **máximo**. `mayor` guarda la mejor venta vista hasta ahora.
- Empieza en `null` ("todavía no hay ninguna"). Empezar en `0` fallaría si todos los valores fueran negativos, y no habría un registro que devolver.
- `mayor === null ||` significa: si aún no hay candidata, la primera venta lo es automáticamente. Gracias al `||`, cuando `mayor` es `null` no se evalúa la segunda parte (que fallaría al intentar leer `null.cantidad`).
- `valorVenta(venta) > valorVenta(mayor)`: si la actual supera a la candidata, la reemplaza.
- Con `[]` devuelve `null` porque no existe ningún registro que devolver.

```js
function ticketPromedio(ventas) {
  let total = 0;
  let ventasValidas = 0;
  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      total += valorVenta(venta);
      ventasValidas += 1;
    }
  }
  if (ventasValidas === 0) {
    return 0;
  }
  return total / ventasValidas;
}
```
- `total`: acumulador del dinero. `ventasValidas`: **contador** de ventas con `cantidad > 0`.
- `if (venta.cantidad > 0)` deja por fuera la venta con cantidad 0, que no cuenta como compra real.
- `if (ventasValidas === 0) return 0;` es la defensa contra `0 / 0 = NaN`. Es la corrección del Error 2 de la gerente.
- `total / ventasValidas` es el promedio.

```js
function ventasPorCiudad(ventas, ciudad) {
  const buscada = normalizarTexto(ciudad);
  let total = 0;
  for (const venta of ventas) {
    if (normalizarTexto(venta.ciudad) === buscada) {
      total += valorVenta(venta);
    }
  }
  return total;
}
```
- `buscada` se normaliza **una sola vez** antes del ciclo (no tiene sentido repetirlo en cada vuelta).
- Dentro del ciclo se normaliza la ciudad de cada venta y se compara con `===` (igualdad estricta). Así `"medellín "` coincide con `"Medellín"`.

### 3.3 MiniReto 3: métodos de arreglo

```js
function totalVendidoM(ventas) {
  return ventas.reduce((acumulado, venta) => acumulado + valorVenta(venta), 0);
}
```
- `reduce` reduce un arreglo a un solo valor. Recibe una función y un **valor inicial** (el `0` del final).
- `acumulado` es el equivalente de `total` en el ciclo; `venta` es la venta actual.
- `(acumulado, venta) => ...` es una función flecha: el valor que devuelve se convierte en el nuevo `acumulado`.
- El valor inicial `0` es obligatorio en la práctica: sin él, con `[]` `reduce` lanzaría un error.

```js
function unidadesVendidasM(ventas) {
  return ventas.reduce((acumulado, venta) => acumulado + venta.cantidad, 0);
}
```
- Igual, pero suma `cantidad`.

```js
function ventasPorCiudadM(ventas, ciudad) {
  const buscada = normalizarTexto(ciudad);
  return ventas
    .filter((venta) => normalizarTexto(venta.ciudad) === buscada)
    .map((venta) => valorVenta(venta))
    .reduce((acumulado, valor) => acumulado + valor, 0);
}
```
- Tres pasos encadenados, que responden a las preguntas de la sesión:
  - `filter`: **¿qué filtro?** Se queda solo con las ventas de la ciudad.
  - `map`: **¿qué transformo?** Convierte cada venta en su valor (un número).
  - `reduce`: **¿qué acumulo?** Suma los valores.
- Ninguno de estos métodos modifica el arreglo original: devuelven arreglos o valores nuevos.

```js
function totalPorCiudad(ventas) {
  return ventas.reduce((grupos, venta) => {
    const nombre = nombreCiudad(venta.ciudad);
    grupos[nombre] = (grupos[nombre] || 0) + valorVenta(venta);
    return grupos;
  }, {});
}
```
- Aquí el valor inicial de `reduce` es `{}` (un objeto vacío): el acumulador es un **diccionario**.
- `grupos` es ese diccionario; `nombre` es el nombre normalizado de la ciudad de esta venta.
- `grupos[nombre] || 0`: si la ciudad aún no existe en el diccionario devuelve `undefined`, y el `|| 0` lo convierte en 0 para poder sumar sin obtener `NaN`.
- `return grupos;` es obligatorio: el `reduce` necesita que devuelvas el acumulador en cada vuelta.
- Gracias a `nombreCiudad`, `"Bogotá"` y `"Bogotá "` van al mismo grupo (corrige el Error 1).

```js
function unidadesPorProducto(ventas) {
  const nombres = {};
  const grupos = {};
  for (const venta of ventas) {
    const clave = normalizarTexto(venta.producto);
    if (nombres[clave] === undefined) {
      nombres[clave] = venta.producto.trim();
    }
    const nombre = nombres[clave];
    grupos[nombre] = (grupos[nombre] || 0) + venta.cantidad;
  }
  return grupos;
}
```
- `nombres`: diccionario `clave normalizada -> primer nombre visto`. Sirve para mostrar un nombre legible.
- `grupos`: el resultado, producto a unidades.
- `clave` es el producto sin espacios, minúsculas ni tildes: así `"prensa francesa"` y `"Prensa Francesa "` caen en el mismo grupo.
- `if (nombres[clave] === undefined)`: solo se guarda el nombre la **primera** vez que aparece esa clave.
- Se suman unidades igual que en `totalPorCiudad`.
- Se escribió con ciclo (permitido en el MiniReto 3) porque con dos diccionarios es más fácil de leer.

```js
function topProductosPorValor(ventas, k) {
  if (k <= 0) {
    return [];
  }
  const nombres = {};
  const valores = {};
  for (const venta of ventas) { ...igual que arriba, pero sumando valorVenta(venta)... }
  const lista = Object.entries(valores).map(([producto, valor]) => ({ producto, valor }));
  const ordenada = [...lista].sort((a, b) => b.valor - a.valor);
  return ordenada.slice(0, k);
}
```

| Línea | Qué hace | Por qué |
| --- | --- | --- |
| `if (k <= 0) return [];` | Si piden 0 o menos productos, devuelve vacío | Evita resultados raros con `slice` |
| `valores` | Diccionario producto a dinero generado | Agrupa antes de ordenar |
| `Object.entries(valores)` | Convierte el objeto en arreglo de pares `[clave, valor]` | Los objetos no se pueden ordenar; los arreglos sí |
| `.map(([producto, valor]) => ({ producto, valor }))` | Convierte cada par en un objeto `{ producto, valor }` | Más legible que `item[0]` e `item[1]` |
| `[...lista]` | **Copia** del arreglo con el operador de propagación | `sort` **modifica** el arreglo sobre el que se llama. Ordenamos la copia y dejamos intacto el original |
| `.sort((a, b) => b.valor - a.valor)` | Ordena de mayor a menor | Si la función devuelve número positivo, `b` va antes que `a`. Con `a.valor - b.valor` sería de menor a mayor |
| `.slice(0, k)` | Toma los primeros `k` elementos | Es el "top k". `slice` tampoco modifica el original |

### 3.4 MiniReto 4: `ventasDelDia`

```js
function ventasDelDia(ventas, fecha) {
  const delDia = ventas.filter((venta) => venta.fecha === fecha);
  return {
    fecha,
    numeroVentas: delDia.length,
    total: totalVendido(delDia),
    unidades: unidadesVendidas(delDia),
    ticketPromedio: ticketPromedio(delDia),
  };
}
```
- `delDia`: arreglo con solo las ventas de esa fecha (puede quedar vacío).
- Se devuelve un objeto resumen. `fecha,` es la forma corta de `fecha: fecha`.
- Reutiliza `totalVendido`, `unidadesVendidas` y `ticketPromedio`: **función pura** que no toca datos externos.
- Si no hubo ventas, `delDia` es `[]` y todo da 0, sin errores ni `NaN`.

### 3.5 Exportar

```js
module.exports = { normalizarTexto, valorVenta, totalVendido, ... };
```
- Se exporta **un objeto** con todas las funciones. En los demás archivos se importan con desestructuración: `const { totalVendido } = require("./analitica");`.

---

## 4. `src/verificar.js`

```js
const ventas = require("./datos");
const { totalVendido, totalVendidoM, ... } = require("./analitica");
```
- Primera línea: trae los datos. Segunda: trae solo las funciones que se van a usar. Las llaves `{ }` sacan esas funciones del objeto exportado.

```js
function comparar(nombre, resultadoCiclo, resultadoMetodo) {
  const estado = resultadoCiclo === resultadoMetodo ? "OK" : "DIFERENTE";
  console.log(`${nombre}: ciclo=${resultadoCiclo} | método=${resultadoMetodo} -> ${estado}`);
}
```
- `comparar` recibe el nombre del indicador y los dos resultados.
- `condición ? "OK" : "DIFERENTE"` es el operador ternario: un `if/else` en una línea.
- Las comillas invertidas `` ` ` `` crean una **plantilla de texto**; `${...}` inserta el valor de una variable dentro del texto.

```js
const entradas = [
  { etiqueta: "completo", datos: ventas },
  { etiqueta: "un elemento", datos: [ventas[0]] },
  { etiqueta: "vacío", datos: [] },
];
```
- `entradas` agrupa los tres casos de prueba que pide el reto. `[ventas[0]]` crea un arreglo con un solo elemento.

```js
for (const entrada of entradas) {
  console.log(`--- Entrada: ${entrada.etiqueta} ---`);
  comparar("totalVendido", totalVendido(entrada.datos), totalVendidoM(entrada.datos));
  ...
}
```
- Para cada caso se ejecutan ambas versiones con los **mismos datos** y se comparan. Si todo sale "OK", los métodos reemplazan correctamente a los ciclos.

---

## 5. `src/reporte.js`

```js
const ANCHO = 52;
```
- Ancho del reporte en caracteres. Va en MAYÚSCULAS por convención: es una constante de configuración. Cambiar el número ajusta todo el reporte.

```js
function pesos(valor) {
  return "$ " + Math.round(valor).toLocaleString("es-CO");
}
```
- `Math.round` quita los decimales (el ticket promedio daba `89545.4545...`).
- `toLocaleString("es-CO")` formatea con las reglas de Colombia: puntos como separador de miles (`985.000`).

```js
function titulo(texto) {
  console.log("");
  console.log("=".repeat(ANCHO));
  console.log(texto.toUpperCase());
  console.log("=".repeat(ANCHO));
}
```
- `"=".repeat(ANCHO)` repite el signo 52 veces para hacer una línea decorativa. `toUpperCase()` pone el título en mayúsculas.

```js
function fila(etiqueta, valor) {
  console.log(etiqueta.padEnd(ANCHO - 18) + String(valor).padStart(18));
}
```
- `padEnd(34)` rellena con espacios a la derecha hasta 34 caracteres: la etiqueta queda alineada a la izquierda.
- `padStart(18)` rellena a la izquierda hasta 18: el valor queda alineado a la derecha. Así se forman las columnas de un informe.
- `String(valor)` convierte números a texto, porque `padStart` solo existe para texto.

**Sección 1, resumen:**
- `const mayor = ventaMayor(ventas);` guarda el registro completo.
- `if (mayor !== null)` protege el caso de arreglo vacío (no se puede leer `.id` de `null`).

**Secciones 2, 3 y 4:**
- `for (const [ciudad, total] of Object.entries(...))` recorre un diccionario: cada par se separa en dos variables (desestructuración).
- `topProductosPorValor(ventas, 3).forEach((item, indice) => {...})` recorre el top; `indice + 1` convierte la posición 0 en "1.".

**Sección 5, día:**
```js
const ventasConFecha = ventas.map((venta, indice) => ({
  ...venta,
  fecha: indice < 6 ? "2026-11-02" : "2026-11-03",
}));
```
- La tabla no tiene fecha. `map` crea **copias** con `fecha` agregada.
- `...venta` copia todas las propiedades de la venta; luego se agrega `fecha`. `datos.js` queda intacto.
- Las primeras 6 ventas se asignan al 2 de noviembre y las demás al 3. Si tu tabla sí trae fecha, borra este bloque y usa `ventas` directamente.

```js
function imprimirDia(fecha) {
  const resumen = ventasDelDia(ventasConFecha, fecha);
  if (resumen.numeroVentas === 0) {
    console.log("  Sin ventas registradas este día.");
  }
  ...
}
```
- Se llama con un día con ventas (`2026-11-02`) y con uno sin ventas (`2026-11-09`). El segundo muestra ceros y un mensaje claro, sin errores ni `NaN`.

---

## 6. `src/depuracion.js`

- Contiene las versiones **con error** (`totalPorCiudadConError` y `ticketPromedioConError`) para reproducir lo que reportó la gerente, y las compara con tus versiones correctas.
- **Error 1:** agrupar con `venta.ciudad` crudo crea claves distintas para `"Bogotá"` y `"Bogotá "`.
- **Error 2:** `total / lista.length` con lista vacía es `0 / 0`, que da `NaN`.
- Esta evidencia es la que debes pegar en la bitácora con el formato síntoma, entrada, hipótesis, prueba, causa y corrección (ya está redactada en `bitacora.md`).

---

## 7. Git: un commit por MiniReto

Primero, la conexión inicial (una sola vez):

```bash
cd cafe-origen-analitica
git init
git branch -M main
git remote add origin https://github.com/TU_USUARIO/cafe-origen-analitica.git
```

Luego, **un commit al terminar cada MiniReto**:

```bash
# MiniReto 1
git add src/datos.js src/analitica.js src/explorar.js bitacora.md README.md
git commit -m "MiniReto 1: estructura del proyecto, datos de ventas y exploración"
git push -u origin main

# MiniReto 2 (cuando tengas los ciclos)
git add .
git commit -m "MiniReto 2: indicadores básicos con ciclos y trazas en la bitácora"
git push

# MiniReto 3
git add .
git commit -m "MiniReto 3: versiones con métodos, agrupaciones, ranking y verificar.js"
git push

# MiniReto 4
git add .
git commit -m "v0.1: reporte por consola, ventasDelDia, depuración y README"
git push
```

Por qué `git add` y luego `git commit`: `add` elige qué cambios entran en el commit; `commit` los guarda con un mensaje; `push` los sube a GitHub. El repositorio en GitHub debe ser **público** y estar creado con el mismo nombre.

**Nota:** esta guía te entrega todo el código terminado. Para que el historial refleje el trabajo real, haz los commits por etapas, a medida que vayas entendiendo y copiando cada MiniReto.

---

## 8. Resultados esperados (con los datos de ejemplo)

| Indicador | Resultado |
| --- | --- |
| Registros | 12 |
| `totalVendido` | 985.000 |
| `unidadesVendidas` | 23 |
| `ticketPromedio` | 89.545 (11 ventas válidas) |
| `ventaMayor` | id 7, 210.000 |
| `totalPorCiudad` | Medellín 330.000, Bogotá 190.000, Cali 251.500, Pereira 213.500 |
| Top 3 por valor | Origen Huila 500 g (420.000), Origen Nariño 250 g (380.000), Molino manual (120.000) |
| `verificar.js` | todo "OK" |
| Día sin ventas | ceros y mensaje claro |

Si usas tus datos reales, tus números serán distintos: lo importante es que `totalVendido` dé 985.000 y que `totalPorCiudad` devuelva exactamente cuatro ciudades.
