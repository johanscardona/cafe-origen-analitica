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

function nombreCiudad(ciudad) {
  const conocidas = {
    medellin: "Medellín",
    bogota: "Bogotá",
    cali: "Cali",
    pereira: "Pereira",
  };
  const clave = normalizarTexto(ciudad);
  return conocidas[clave] || ciudad.trim();
}


function valorVenta(venta) {
  return venta.cantidad * venta.precio;
}

function totalVendido(ventas) {
  let total = 0;
  for (const venta of ventas) {
    total += valorVenta(venta);
  }
  return total;
}

function unidadesVendidas(ventas) {
  let unidades = 0;
  for (const venta of ventas) {
    unidades += venta.cantidad;
  }
  return unidades;
}

function ventaMayor(ventas) {
  let mayor = null;
  for (const venta of ventas) {
    if (mayor === null || valorVenta(venta) > valorVenta(mayor)) {
      mayor = venta;
    }
  }
  return mayor;
}

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


function totalVendidoM(ventas) {
  return ventas.reduce((acumulado, venta) => acumulado + valorVenta(venta), 0);
}

function unidadesVendidasM(ventas) {
  return ventas.reduce((acumulado, venta) => acumulado + venta.cantidad, 0);
}

function ventasPorCiudadM(ventas, ciudad) {
  const buscada = normalizarTexto(ciudad);
  return ventas
    .filter((venta) => normalizarTexto(venta.ciudad) === buscada)
    .map((venta) => valorVenta(venta))
    .reduce((acumulado, valor) => acumulado + valor, 0);
}

function totalPorCiudad(ventas) {
  return ventas.reduce((grupos, venta) => {
    const nombre = nombreCiudad(venta.ciudad);
    grupos[nombre] = (grupos[nombre] || 0) + valorVenta(venta);
    return grupos;
  }, {});
}

function unidadesPorProducto(ventas) {
  const nombres = {}; // clave normalizada -> nombre para mostrar
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

function topProductosPorValor(ventas, k) {
  if (k <= 0) {
    return [];
  }
  const nombres = {};
  const valores = {};
  for (const venta of ventas) {
    const clave = normalizarTexto(venta.producto);
    if (nombres[clave] === undefined) {
      nombres[clave] = venta.producto.trim();
    }
    const nombre = nombres[clave];
    valores[nombre] = (valores[nombre] || 0) + valorVenta(venta);
  }
  const lista = Object.entries(valores).map(([producto, valor]) => ({ producto, valor }));
  const ordenada = [...lista].sort((a, b) => b.valor - a.valor);
  return ordenada.slice(0, k);
}

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

module.exports = {
  normalizarTexto,
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
};
