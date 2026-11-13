const ventas = require("./datos");
const {
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
} = require("./analitica");

const ANCHO = 52;

function pesos(valor) {
  return "$ " + Math.round(valor).toLocaleString("es-CO");
}

function titulo(texto) {
  console.log("");
  console.log("=".repeat(ANCHO));
  console.log(texto.toUpperCase());
  console.log("=".repeat(ANCHO));
}

function fila(etiqueta, valor) {
  console.log(etiqueta.padEnd(ANCHO - 18) + String(valor).padStart(18));
}

titulo("Café Origen - Reporte v0.1");
console.log("1. RESUMEN GENERAL");
const mayor = ventaMayor(ventas);
fila("Total vendido", pesos(totalVendido(ventas)));
fila("Unidades vendidas", unidadesVendidas(ventas).toLocaleString("es-CO"));
fila("Ticket promedio", pesos(ticketPromedio(ventas)));
if (mayor !== null) {
  fila(`Venta mayor (id ${mayor.id})`, pesos(mayor.cantidad * mayor.precio));
}

console.log("\n2. VENTAS POR CIUDAD");
for (const [ciudad, total] of Object.entries(totalPorCiudad(ventas))) {
  fila(ciudad, pesos(total));
}

console.log("\n3. UNIDADES POR PRODUCTO");
for (const [producto, unidades] of Object.entries(unidadesPorProducto(ventas))) {
  fila(producto, unidades);
}

console.log("\n4. TOP 3 PRODUCTOS POR VALOR");
topProductosPorValor(ventas, 3).forEach((item, indice) => {
  fila(`${indice + 1}. ${item.producto}`, pesos(item.valor));
});

const ventasConFecha = ventas.map((venta, indice) => ({
  ...venta,
  fecha: indice < 6 ? "2026-11-02" : "2026-11-03",
}));

function imprimirDia(fecha) {
  const resumen = ventasDelDia(ventasConFecha, fecha);
  console.log(`\nDÍA ${fecha}`);
  if (resumen.numeroVentas === 0) {
    console.log("  Sin ventas registradas este día.");
  }
  fila("  Ventas", resumen.numeroVentas);
  fila("  Total", pesos(resumen.total));
  fila("  Unidades", resumen.unidades);
  fila("  Ticket promedio", pesos(resumen.ticketPromedio));
}

console.log("\n5. RESUMEN POR DÍA");
imprimirDia("2026-11-02");
imprimirDia("2026-11-09");
console.log("");
