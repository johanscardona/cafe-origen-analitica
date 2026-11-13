# Bitácora - Café Origen Analítica

## MiniReto 1: Exploración de datos

### Diccionario de datos

| Propiedad | Tipo | Significado |
| --- | --- | --- |
| `id` | number | Identificador único de la venta |
| `cliente` | string | Código del cliente (por ejemplo "C01") |
| `producto` | string | Nombre del producto vendido |
| `ciudad` | string | Ciudad donde se hizo la venta |
| `cantidad` | number | Unidades vendidas en esa venta |
| `precio` | number | Precio por unidad en pesos colombianos (COP) |

Valor de una venta = `cantidad * precio`.

### Casos borde detectados

| # | Problema | Dónde se ve | Decisión |
| --- | --- | --- | --- |
| 1 | Ciudades con espacios sobrantes, mayúsculas o sin tilde ("medellín ", "Bogotá ", "Medellin") | ids 1, 4, 6 | No modifico `datos.js`. Normalizo al comparar y agrupar: `trim()`, `toLowerCase()` y quitar tildes. |
| 2 | Cantidad igual a 0 | id 6 | Cuenta en el total (aporta 0) pero NO es una venta válida para el ticket promedio. |
| 3 | Cliente vacío | id 8 | Se conserva la venta en los totales; se excluiría de cualquier análisis por cliente. |
| 4 | Mismo producto escrito distinto ("prensa francesa", "Prensa Francesa ") | ids 3, 6, 9 | Se agrupan normalizando el nombre; se muestra el primer nombre encontrado. |
| 5 | Cliente repetido en varias compras (C01, C02, C03) | ids 1 y 5, 2 y 10, 3 y 9 | No es un error: es un cliente recurrente. Se deja igual. |

## MiniReto 2: Indicadores con ciclos

### Pseudocódigo

**totalVendido**
```
total = 0
para cada venta en ventas:
    total = total + valorVenta(venta)
devolver total
```

**unidadesVendidas**
```
unidades = 0
para cada venta en ventas:
    unidades = unidades + venta.cantidad
devolver unidades
```

**ventaMayor**
```
mayor = null
para cada venta en ventas:
    si mayor es null O valorVenta(venta) > valorVenta(mayor):
        mayor = venta
devolver mayor
```

**ticketPromedio**
```
total = 0
validas = 0
para cada venta en ventas:
    si venta.cantidad > 0:
        total = total + valorVenta(venta)
        validas = validas + 1
si validas == 0: devolver 0
devolver total / validas
```

**ventasPorCiudad**
```
buscada = normalizar(ciudad)
total = 0
para cada venta en ventas:
    si normalizar(venta.ciudad) == buscada:
        total = total + valorVenta(venta)
devolver total
```

### Qué devuelve cada función con el arreglo vacío

| Función | Con `[]` | Razón |
| --- | --- | --- |
| `totalVendido` | `0` | Sumar nada da cero |
| `unidadesVendidas` | `0` | Igual |
| `ventaMayor` | `null` | No existe ningún registro que devolver |
| `ticketPromedio` | `0` | Evita dividir 0 / 0, que daría NaN |
| `ventasPorCiudad` | `0` | No hubo ventas en esa ciudad |

### Trazas manuales

**Traza 1: `totalVendido` con las 12 ventas**

| id | valorVenta | total acumulado |
| --- | --- | --- |
| (inicio) | - | 0 |
| 1 | 2 x 42.000 = 84.000 | 84.000 |
| 2 | 1 x 95.000 = 95.000 | 179.000 |
| 3 | 1 x 9.500 = 9.500 | 188.500 |
| 4 | 3 x 42.000 = 126.000 | 314.500 |
| 5 | 2 x 95.000 = 190.000 | 504.500 |
| 6 | 0 x 9.500 = 0 | 504.500 |
| 7 | 5 x 42.000 = 210.000 | 714.500 |
| 8 | 1 x 120.000 = 120.000 | 834.500 |
| 9 | 2 x 9.500 = 19.000 | 853.500 |
| 10 | 1 x 95.000 = 95.000 | 948.500 |
| 11 | 4 x 8.000 = 32.000 | 980.500 |
| 12 | 1 x 4.500 = 4.500 | 985.000 |

Resultado a mano: 985.000. El programa devuelve 985000. Coinciden.

**Traza 2: `ventaMayor` con las 12 ventas**

| id | valorVenta | ¿supera al mayor? | mayor después |
| --- | --- | --- | --- |
| 1 | 84.000 | sí (mayor era null) | id 1 |
| 2 | 95.000 | sí | id 2 |
| 3 | 9.500 | no | id 2 |
| 4 | 126.000 | sí | id 4 |
| 5 | 190.000 | sí | id 5 |
| 6 | 0 | no | id 5 |
| 7 | 210.000 | sí | id 7 |
| 8 | 120.000 | no | id 7 |
| 9 | 19.000 | no | id 7 |
| 10 | 95.000 | no | id 7 |
| 11 | 32.000 | no | id 7 |
| 12 | 4.500 | no | id 7 |

Resultado a mano: id 7 con 210.000. El programa devuelve lo mismo.

## MiniReto 3: Métodos de arreglo, agrupaciones y rankings

| Función | ¿Qué recorro? | ¿Qué filtro? | ¿Qué transformo? | ¿Qué acumulo? | ¿Cómo agrupo? |
| --- | --- | --- | --- | --- | --- |
| `totalVendidoM` | las ventas | nada | nada (valorVenta dentro de reduce) | valor de cada venta | no agrupo |
| `unidadesVendidasM` | las ventas | nada | nada | `cantidad` | no agrupo |
| `ventasPorCiudadM` | las ventas | las de la ciudad buscada | cada venta a su valor | suma de valores | no agrupo |
| `totalPorCiudad` | las ventas | nada | ciudad a nombre normalizado | valor por ciudad | objeto con la ciudad como clave |
| `unidadesPorProducto` | las ventas | nada | producto a clave normalizada | unidades por producto | objeto con el producto como clave |
| `topProductosPorValor` | las ventas, luego las entradas del objeto | nada (corta con `slice`) | entradas a `{producto, valor}` | valor por producto | objeto por producto, luego `sort` desc |

`verificar.js` ejecuta el par ciclo/método con tres entradas (completa, un elemento y vacía): todos los resultados salen "OK".

## MiniReto 4: Depuración

### Error 1: "Bogotá aparecía dos veces"

- **Síntoma:** el reporte mostraba dos grupos para la misma ciudad.
- **Entrada que lo produce:** ventas con ciudad `"Bogotá"` y `"Bogotá "` (con espacio al final).
- **Hipótesis:** el programa usa el texto crudo de la ciudad como clave del objeto.
- **Prueba realizada:** `node src/depuracion.js` imprime las claves de la versión preliminar: salen `'Bogotá'` y `'Bogotá '` por separado (y también `'Medellin'`, `'medellín '` y `'Medellín'`).
- **Causa:** para JavaScript `"Bogotá"` y `"Bogotá "` son claves distintas.
- **Corrección:** `normalizarTexto` (trim, minúsculas, sin tildes) antes de agrupar. Con mi versión salen exactamente 4 claves: Medellín, Bogotá, Cali, Pereira.

### Error 2: "El ticket promedio daba NaN en un día sin ventas"

- **Síntoma:** el ticket promedio mostraba `NaN`.
- **Entrada que lo produce:** una lista vacía (un día sin ventas).
- **Hipótesis:** se divide el total entre la cantidad de ventas, y esa cantidad es 0.
- **Prueba realizada:** `0 / 0` en la versión preliminar devuelve `NaN`; con mi versión el resultado es 0.
- **Causa:** división 0 / 0.
- **Corrección:** si no hay ventas válidas, `ticketPromedio` devuelve 0 antes de dividir. `ventasDelDia` devuelve ceros y `reporte.js` muestra "Sin ventas registradas este día."

## Nota sobre los datos

La tabla original no trae columna de fecha. Para demostrar `ventasDelDia`, `reporte.js` asigna fechas de ejemplo a copias de las ventas (sin modificar `datos.js`).
