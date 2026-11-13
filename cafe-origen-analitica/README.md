# Café Origen - Analítica v0.1

Motor de analítica por consola para Café Origen. Toma el historial de ventas (un arreglo de objetos) y calcula indicadores de negocio con JavaScript puro, sin librerías externas.

## Cómo ejecutarlo

Requisito: Node.js (versión LTS).

```bash
node src/explorar.js    
node src/verificar.js   
node src/reporte.js   
node src/depuracion.js  
```

## Qué preguntas responde

- ¿Cuánto se vendió en total y cuántas unidades salieron?
- ¿Cuál fue la venta más grande?
- ¿Cuánto gasta en promedio un cliente por compra (ticket promedio)?
- ¿Cuánto se vendió en cada ciudad?
- ¿Cuántas unidades se vendieron de cada producto?
- ¿Cuáles son los 3 productos que más dinero generaron?
- ¿Cómo le fue a la tienda en un día concreto (incluso si no hubo ventas)?

## Estructura

| Archivo | Para qué sirve |
| --- | --- |
| `src/datos.js` | Las 12 ventas, tal como vienen (con sus errores) |
| `src/analitica.js` | Todas las funciones de cálculo |
| `src/explorar.js` | Exploración inicial de los datos |
| `src/verificar.js` | Demuestra que ciclo y método dan el mismo resultado |
| `src/reporte.js` | Reporte final por consola |
| `src/depuracion.js` | Reproducción de los errores reportados |
| `bitacora.md` | Decisiones, pseudocódigo, trazas y depuración |
