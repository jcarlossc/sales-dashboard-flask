// ============================================================
// Dados do dashboard
// ============================================================
const dashboardElement =
    document.getElementById("dashboard-data");

const dashboardData =
    JSON.parse(dashboardElement.textContent);

// ============================================================
// Configuração global
// ============================================================
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = "#94a3b8";

// ============================================================
// Gradiente
// ============================================================
function createGradient(context) {
    const gradient = context.createLinearGradient(0,0,0,340);
    gradient.addColorStop(0,"rgba(56, 189, 248, 0.30)");
    gradient.addColorStop(1,"rgba(56, 189, 248, 0.00)");
    return gradient;
}
// ============================================================
// VENDAS
// ============================================================
// Vendas por mês
// ============================================================
const monthlyCanvas = document.getElementById("salesMonth");
if (monthlyCanvas) {
    const context = monthlyCanvas.getContext("2d");
    const gradient = createGradient(context);
    new Chart(context, {
        type: "line",
        data: {
            labels: dashboardData.salesMonth.map(
                item => item.month
                ),
            datasets: [
                {
                    label: "Vendas",
                    data: dashboardData.salesMonth.map(
                            item => item.gross_revenue
                        ),
                    borderColor: "#38bdf8",
                    backgroundColor: gradient,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: "#38bdf8",
                    pointHoverBorderColor: "#ffffff",
                    pointHoverBorderWidth: 2,
                    fill: true,
                    tension: 0.4,
                }
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: "index",
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderColor: "rgba(56, 189, 248, 0.3)",
                    borderWidth: 1,
                    padding: 12,
                    titleColor: "#f8fafc",
                    bodyColor: "#cbd5e1",
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                                return (
                                    " R$ " +
                                    context.parsed.y.toLocaleString(
                                        "pt-BR",
                                        {
                                            minimumFractionDigits: 2,
                                        }
                                    )
                                );
                            },
                    },
                },
            },
            scales: {
                x: {
                    grid: {display: false,},
                    border: {display: false,},
                },
                y: {
                    beginAtZero: true,
                    grid: {color:"rgba(255, 255, 255, 0.06)",},
                    border: {display: false,},
                    ticks: {
                        callback: function(value) {
                                return (
                                    "R$ " +
                                    value.toLocaleString(
                                        "pt-BR",
                                        {
                                            notation: "compact",
                                        }
                                    )
                                );
                            },
                    },
                },
            },
        },
    });
}