const ventas = require("./datos");
const {
  totalVendido,
  totalVendidoM,
  unidadesVendidas,
  unidadesVendidasM,
  ventasPorCiudad,
  ventasPorCiudadM,
} = require("./analitica");

function comparar(nombre, resultadoCiclo, resultadoMetodo) {
  const estado = resultadoCiclo === resultadoMetodo ? "OK" : "DIFERENTE";
  console.log(`${nombre}: ciclo=${resultadoCiclo} | método=${resultadoMetodo} -> ${estado}`);
}

const entradas = [
  { etiqueta: "completo", datos: ventas },
  { etiqueta: "un elemento", datos: [ventas[0]] },
  { etiqueta: "vacío", datos: [] },
];

for (const entrada of entradas) {
  console.log(`--- Entrada: ${entrada.etiqueta} ---`);
  comparar("totalVendido", totalVendido(entrada.datos), totalVendidoM(entrada.datos));
  comparar("unidadesVendidas", unidadesVendidas(entrada.datos), unidadesVendidasM(entrada.datos));
  comparar(
    'ventasPorCiudad("Medellín")',
    ventasPorCiudad(entrada.datos, "Medellín"),
    ventasPorCiudadM(entrada.datos, "Medellín")
  );
}
