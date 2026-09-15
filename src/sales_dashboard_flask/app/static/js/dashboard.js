document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // SEÇÃO ATIVA
    // =====================================================

    const params = new URLSearchParams(window.location.search);

    // Se não houver section na URL, usa sales
    const sectionName = params.get("section") || "sales";


    // =====================================================
    // MOSTRA A SEÇÃO DO DASHBOARD
    // =====================================================

    const sections = document.querySelectorAll(".dashboard-section");

    sections.forEach(section => {
        section.style.display = "none";
    });

    const activeSection = document.getElementById(sectionName);

    if (activeSection) {
        activeSection.style.display = "block";
    }


    // =====================================================
    // ATIVA O BOTÃO DO MENU
    // =====================================================

    const menuItems = document.querySelectorAll(".menu-item");

    // Remove active de todos
    menuItems.forEach(item => {
        item.classList.remove("active");
    });

    // Adiciona active somente ao botão selecionado
    const activeMenuItem = document.querySelector(
        `.menu-item[data-section="${sectionName}"]`
    );

    if (activeMenuItem) {
        activeMenuItem.classList.add("active");
    }

});
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
// ============================================================
// Vendas por produto
// ============================================================
const productSalesCanvas = document.getElementById("salesProducts");

if (productSalesCanvas) {
    new Chart(productSalesCanvas, {
        type: "bar",
        data: {
            labels:
                dashboardData.salesProducts.map(
                    item => item.Product_Name
                ),
            datasets: [
                {
                    label: "Vendas",
                    data: dashboardData.salesProducts.map(
                            item => item.gross_revenue
                        ),
                    backgroundColor: "rgba(56, 189, 248, 0.75)",
                    borderRadius: 6,
                    borderSkipped: false,
                    barThickness: 5,
                }
            ],
        },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {display: false,},
                tooltip: {
                    backgroundColor:"rgba(15, 23, 42, 0.95)",
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return (
                                " R$ " +
                                context.parsed.x.toLocaleString(
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
                    beginAtZero: true,
                    grid: {color: "rgba(255, 255, 255, 0.06)",},
                    border: {display: false,},
                },
                y: {
                    grid: {display: false,},
                    border: {display: false,},
                },
            },
        },
    });
}
// ============================================================
// Vendas por região
// ============================================================
const salesRegions = dashboardData.salesRegions;

const salesRegionsCanvas = document.getElementById("salesRegions");

if (salesRegionsCanvas && Array.isArray(salesRegions)) {
    const context = monthlyCanvas.getContext("2d");
    const gradient = createGradient(context);
    new Chart(salesRegionsCanvas, {
        type: "bar",

        data: {
            labels: salesRegions.map(item => item.Region),

            datasets: [
                {
                    label: "Vendas",
                    data: salesRegions.map(item => item.gross_revenue),
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                    barThickness: 20,
                }
            ]
        },

        options: {
            indexAxis: "y",

            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD"
                            }).format(context.raw);
                        }
                    }
                }
            },

            scales: {
                x: {
                    beginAtZero: true,

                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                notation: "compact"
                            }).format(value);
                        }
                    }
                }
            }
        }
    });
}

// ============================================================
// Vendas por método de pagamento
// ============================================================
const salesPaymentMethodsCanvas = document.getElementById("salesPaymentMethods");

const salesPaymentMethods = dashboardData.salesPaymentMethods;

if (
    salesPaymentMethodsCanvas &&
    Array.isArray(salesPaymentMethods)
) {
    new Chart(salesPaymentMethodsCanvas, {
        type: "pie",

        data: {
            labels: salesPaymentMethods.map(
                item => item.Payment_Method
            ),

            datasets: [
                {
                    label: "Vendas",
                    data: salesPaymentMethods.map(
                        item => item.gross_revenue
                    ),
                    borderWidth: 1
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "right"
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;

                            const total = context.dataset.data.reduce(
                                (sum, current) => sum + current,
                                0
                            );

                            const percentage = (
                                (value / total) * 100
                            ).toFixed(1);

                            const formattedValue =
                                new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD"
                                }).format(value);

                            return `${context.label}: ${formattedValue} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ============================================================
// Vendas por categoria
// ============================================================
const salesCategoriesCanvas = document.getElementById("salesCategories");

const salesCategories = dashboardData.salesCategories;

if (
    salesCategoriesCanvas &&
    Array.isArray(salesCategories)
) {
    new Chart(salesCategoriesCanvas, {
        type: "bar",
        data: {
            labels: salesCategories.map(
                item => item.Product_Category
            ),
            datasets: [
                {
                    label: "Vendas",
                    data: salesCategories.map(
                        item => item.gross_revenue
                    ),
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                    barThickness: 50,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return new Intl.NumberFormat(
                                "en-US",
                                {
                                    style: "currency",
                                    currency: "USD"
                                }
                            ).format(context.raw);
                        }
                    }
                }
            },

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat(
                                "en-US",
                                {
                                    style: "currency",
                                    currency: "USD",
                                    notation: "compact"
                                }
                            ).format(value);
                        }
                    }
                }
            }
        }
    });
}