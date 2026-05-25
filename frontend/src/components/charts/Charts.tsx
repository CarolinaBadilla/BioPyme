import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, Cell } from "recharts";
import type { Company } from "../../types";

interface ChartsProps {
  companies: Company[];
  selectedCompany: Company | null;
}

export default function Charts({ companies, selectedCompany }: ChartsProps) {
  if (!selectedCompany) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-xl shadow-md p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500">Seleccioná una planta del listado</p>
        </div>
      </div>
    );
  }

  const grossMargin = selectedCompany.biodieselPrice - selectedCompany.variableCost;
  const savingsPercent = ((selectedCompany.fossilDieselPrice - selectedCompany.biodieselPrice) / selectedCompany.fossilDieselPrice * 100);
  const coverageDays = selectedCompany.stockLiters / (selectedCompany.monthlyDemand / 30);
  const capacityUse = (selectedCompany.monthlyDemand / 25) / selectedCompany.dailyCapacity * 100;
  
  // DATOS DE ESTACIONALIDAD (ejemplo - se pueden reemplazar con datos reales)
  // Estos datos muestran la demanda mensual típica en Córdoba
  const seasonalityData = [
    { mes: "Ene", demanda: 38000, color: "#3b82f6" },
    { mes: "Feb", demanda: 35000, color: "#3b82f6" },
    { mes: "Mar", demanda: 32000, color: "#3b82f6" },
    { mes: "Abr", demanda: 28000, color: "#3b82f6" },
    { mes: "May", demanda: 25000, color: "#3b82f6" },
    { mes: "Jun", demanda: 24000, color: "#3b82f6" },
    { mes: "Jul", demanda: 26000, color: "#3b82f6" },
    { mes: "Ago", demanda: 29000, color: "#3b82f6" },
    { mes: "Sep", demanda: 33000, color: "#3b82f6" },
    { mes: "Oct", demanda: 37000, color: "#3b82f6" },
    { mes: "Nov", demanda: 39000, color: "#3b82f6" },
    { mes: "Dic", demanda: 42000, color: "#ef4444" }, // Pico en diciembre
  ];

  // Evolución de precios
  const priceHistory = [
    { mes: "Ene", biodiesel: selectedCompany.biodieselPrice - 30, fosil: 920 },
    { mes: "Feb", biodiesel: selectedCompany.biodieselPrice - 20, fosil: 930 },
    { mes: "Mar", biodiesel: selectedCompany.biodieselPrice - 10, fosil: 940 },
    { mes: "Abr", biodiesel: selectedCompany.biodieselPrice - 5, fosil: 945 },
    { mes: "May", biodiesel: selectedCompany.biodieselPrice, fosil: 950 },
    { mes: "Jun", biodiesel: selectedCompany.biodieselPrice + 5, fosil: 955 },
  ];

  // Rentabilidad por litro
  const profitabilityData = [
    { name: "Precio Venta", valor: selectedCompany.biodieselPrice },
    { name: "Costo Variable", valor: selectedCompany.variableCost },
    { name: "Margen Bruto", valor: grossMargin },
  ];

  // Análisis de stock
  const stockAnalysis = [
    { name: "Stock Actual", valor: selectedCompany.stockLiters },
    { name: "Stock Óptimo", valor: selectedCompany.monthlyDemand / 2 },
    { name: "Stock Mínimo", valor: selectedCompany.monthlyDemand / 4 },
  ];

  // Capacidad vs Demanda
  const capacityData = [
    { name: "Capacidad Instalada", valor: selectedCompany.dailyCapacity * 25 },
    { name: "Demanda Mensual", valor: selectedCompany.monthlyDemand },
    { name: "Producción Actual", valor: selectedCompany.productionMonth },
  ];

  // Rentabilidad por cliente
  const profitabilityByCustomer = [
    { tipo: "Pequeño", consumo: 500, ganancia: 500 * grossMargin, color: "#3b82f6" },
    { tipo: "Mediano", consumo: 2000, ganancia: 2000 * grossMargin, color: "#10b981" },
    { tipo: "Grande", consumo: 10000, ganancia: 10000 * grossMargin, color: "#f59e0b" },
    { tipo: "Corporativo", consumo: 50000, ganancia: 50000 * grossMargin, color: "#ef4444" },
  ];

  // Encontrar mes pico
  const maxMonth = seasonalityData.reduce((max, m) => m.demanda > max.demanda ? m : max, seasonalityData[0]);

  return (
    <div className="p-4 space-y-4 bg-gray-50 min-h-full">
      <h2 className="text-xl font-bold text-gray-800">📈 Análisis: {selectedCompany.name}</h2>
      
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-3 shadow-md">
          <p className="text-xs text-blue-200">Margen Bruto</p>
          <p className="text-2xl font-bold text-white">${grossMargin.toFixed(0)}</p>
          <p className="text-xs text-blue-300">por litro</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-3 shadow-md">
          <p className="text-xs text-emerald-200">Ahorro vs Fósil</p>
          <p className="text-2xl font-bold text-white">{savingsPercent.toFixed(1)}%</p>
          <p className="text-xs text-emerald-300">${(selectedCompany.fossilDieselPrice - selectedCompany.biodieselPrice).toFixed(0)}/L</p>
        </div>
        <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-3 shadow-md">
          <p className="text-xs text-amber-200">Cobertura Stock</p>
          <p className="text-2xl font-bold text-white">{Math.floor(coverageDays)}</p>
          <p className="text-xs text-amber-300">días</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-3 shadow-md">
          <p className="text-xs text-purple-200">Capacidad Utilizada</p>
          <p className="text-2xl font-bold text-white">{capacityUse.toFixed(0)}%</p>
          <p className="text-xs text-purple-300">del total</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Gráfico 1: Estacionalidad de la Demanda */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">📅 Estacionalidad de la Demanda</h3>
          <BarChart width={350} height={250} data={seasonalityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()} L`} />
            <Bar dataKey="demanda">
              {seasonalityData.map((entry, idx) => (
                <Cell key={idx} fill={entry.mes === "Dic" ? "#ef4444" : "#3b82f6"} />
              ))}
            </Bar>
          </BarChart>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Pico máximo en {maxMonth.mes}: {maxMonth.demanda.toLocaleString()} L
          </p>
        </div>

        {/* Gráfico 2: Evolución de Precios */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">📈 Evolución de Precios</h3>
          <LineChart width={350} height={250} data={priceHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value}`} />
            <Legend />
            <Line type="monotone" dataKey="biodiesel" stroke="#3b82f6" name="Biodiesel" strokeWidth={2} />
            <Line type="monotone" dataKey="fosil" stroke="#ef4444" name="Diesel Fósil" strokeWidth={2} />
          </LineChart>
          <p className="text-xs text-gray-500 mt-2 text-center">Tendencia de precios últimos 6 meses</p>
        </div>

        {/* Gráfico 3: Rentabilidad por Litro */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">💰 Rentabilidad por Litro</h3>
          <BarChart width={350} height={250} data={profitabilityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value}`} />
            <Bar dataKey="valor" fill="#10b981" />
          </BarChart>
          <p className="text-xs text-gray-500 mt-2 text-center">Precio, costo y margen por litro</p>
        </div>

        {/* Gráfico 4: Análisis de Stock */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">📦 Análisis de Stock</h3>
          <BarChart width={350} height={250} data={stockAnalysis}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
            <YAxis tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()} L`} />
            <Bar dataKey="valor" fill="#f59e0b" />
          </BarChart>
          <p className="text-xs text-gray-500 mt-2 text-center">Stock actual vs niveles óptimos</p>
        </div>

        {/* Gráfico 5: Capacidad vs Demanda */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">🏭 Capacidad vs Demanda</h3>
          <BarChart width={350} height={250} data={capacityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
            <YAxis tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()} L`} />
            <Bar dataKey="valor" fill="#8b5cf6" />
          </BarChart>
          <p className="text-xs text-gray-500 mt-2 text-center">Potencial de crecimiento sin inversión</p>
        </div>

        {/* Gráfico 6: Rentabilidad por Cliente */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">👥 Rentabilidad por Cliente</h3>
          <BarChart width={350} height={250} data={profitabilityByCustomer}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo" />
            <YAxis tickFormatter={(value: number) => `$${value/1000}k`} />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Bar dataKey="ganancia">
              {profitabilityByCustomer.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
          <p className="text-xs text-gray-500 mt-2 text-center">Ganancia mensual por tipo de cliente</p>
        </div>
      </div>
    </div>
  );
}