const ventas = require("./datos");
const { totalPorCiudad, ticketPromedio, ventasDelDia } = require("./analitica");

function totalPorCiudadConError(lista) {
  const grupos = {};
  for (const venta of lista) {
    grupos[venta.ciudad] = (grupos[venta.ciudad] || 0) + venta.cantidad * venta.precio;
  }
  return grupos;
}

console.log("ERROR 1 - versión preliminar:");
console.log(Object.keys(totalPorCiudadConError(ventas)));
console.log("ERROR 1 - mi versión:");
console.log(Object.keys(totalPorCiudad(ventas)));

function ticketPromedioConError(lista) {
  let total = 0;
  for (const venta of lista) {
    total += venta.cantidad * venta.precio;
  }
  return total / lista.length; // Error: 0 / 0 = NaN
}

const diaSinVentas = ventas.filter((venta) => venta.fecha === "2026-11-09");
console.log("\nERROR 2 - versión preliminar:", ticketPromedioConError(diaSinVentas));
console.log("ERROR 2 - mi versión:", ticketPromedio(diaSinVentas));
console.log("ERROR 2 - ventasDelDia sin ventas:", ventasDelDia(ventas, "2026-11-09"));
