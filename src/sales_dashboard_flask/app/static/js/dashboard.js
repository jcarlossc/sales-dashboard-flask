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

// ============================================================
// FINANCEIRO
// ============================================================
// Pedido por mês
// ============================================================
const ordersByMonthCanvas = document.getElementById("ordersByMonth");

if (ordersByMonthCanvas) {
    const ordersByMonth = dashboardData.ordersByMonth;

    new Chart(ordersByMonthCanvas, {
        type: "line",

        data: {
            labels: ordersByMonth.map(item => item.month),

            datasets: [{
                label: "Pedidos",
                data: ordersByMonth.map(item => item.orders),

                borderWidth: 2,
                tension: 0.3,
                fill: false,

                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: true
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Pedidos: ${context.parsed.y}`;
                        }
                    }
                }
            },

            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Mês"
                    }
                },

                y: {
                    beginAtZero: true,

                    title: {
                        display: true,
                        text: "Quantidade de pedidos"
                    },

                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

// ============================================================
// Desconto por lucro
// ============================================================
const discountProfitCanvas = document.getElementById("discountProfit");

if (discountProfitCanvas) {
    const discountProfit = dashboardData.discountProfit;
    new Chart(discountProfitCanvas, {
        type: "scatter",
        data: {
            datasets: [{
                label: "Desconto × Lucro",

                data: discountProfit.map(item => ({
                    x: item.Discount_Percent,
                    y: item.profit
                })),

                pointRadius: 5,
                pointHoverRadius: 7,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return [
                                `Desconto: $${context.parsed.x.toFixed(2)}`,
                                `Lucro: $${context.parsed.y.toFixed(2)}`
                            ];
                        }
                    }
                }
            },

            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Desconto"
                    },

                    ticks: {
                        callback: function(value) {
                            return "$" + value;
                        }
                    }
                },

                y: {
                    title: {
                        display: true,
                        text: "Lucro"
                    },

                    ticks: {
                        callback: function(value) {
                            return "$" + value;
                        }
                    }
                }
            }
        }
    });
}

// ============================================================
// Frete × Receita
// ============================================================
const shippingRevenueCanvas =
    document.getElementById("shippingRevenue");

if (shippingRevenueCanvas) {
    const shippingRevenue = dashboardData.shippingRevenue;

    new Chart(shippingRevenueCanvas, {
        type: "scatter",

        data: {
            datasets: [{
                label: "Custo de frete × Receita",

                data: shippingRevenue.map(item => ({
                    x: item.shipping_cost,
                    y: item.revenue
                })),

                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: true
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return [
                                `Frete: $${context.parsed.x.toFixed(2)}`,
                                `Receita: $${context.parsed.y.toFixed(2)}`
                            ];
                        }
                    }
                }
            },

            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Custo de frete"
                    },

                    ticks: {
                        callback: function(value) {
                            return "$" + value;
                        }
                    }
                },

                y: {
                    title: {
                        display: true,
                        text: "Receita"
                    },

                    ticks: {
                        callback: function(value) {
                            return "$" + value;
                        }
                    }
                }
            }
        }
    });
}

// ============================================================
// Custo e lucro ao longo do tempo
// ============================================================
const financialByMonthCanvas =
    document.getElementById("financialByMonth");

if (financialByMonthCanvas) {
    const financialByMonth = dashboardData.financialByMonth;

    new Chart(financialByMonthCanvas, {
        type: "line",

        data: {
            labels: financialByMonth.map(item => item.month),

            datasets: [
                {
                    label: "Receita",
                    data: financialByMonth.map(item => item.revenue),

                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 6
                },

                {
                    label: "Custo",
                    data: financialByMonth.map(item => item.cost),

                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 6
                },

                {
                    label: "Lucro",
                    data: financialByMonth.map(item => item.profit),

                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: true
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return (
                                `${context.dataset.label}: $` +
                                context.parsed.y.toLocaleString(
                                    "en-US",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                )
                            );
                        }
                    }
                }
            },

            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Mês"
                    }
                },

                y: {
                    beginAtZero: true,

                    title: {
                        display: true,
                        text: "Valor ($)"
                    },

                    ticks: {
                        callback: function(value) {
                            return "$" + value.toLocaleString("en-US");
                        }
                    }
                }
            }
        }
    });
}

// ============================================================
// TEMPORAL
// ============================================================
// Faturamento Anual
// ============================================================
const salesYear = dashboardData.salesYear;

new Chart(document.getElementById("salesYear"), {
    type: "line",

    data: {
        labels: salesYear.map(item => item.year),

        datasets: [
            {
                label: "Faturamento",
                data: salesYear.map(item => item.sales),
                tension: 0.3,
                fill: true,
            },
        ],
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        scales: {
            x: {
                title: {
                    display: true,
                    text: "Ano",
                },
            },

            y: {
                title: {
                    display: true,
                    text: "Faturamento",
                },

                ticks: {
                    callback: function (value) {
                        return "$ " + value.toLocaleString("en-US");
                    },
                },
            },
        },

        plugins: {
            legend: {
                display: false,
            },

            tooltip: {
                callbacks: {
                    label: function (context) {
                        return "$ " + context.parsed.y.toLocaleString(
                            "en-US",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }
                        );
                    },
                },
            },
        },
    },
});

// ============================================================
// Lucro por mês
// ============================================================
const profitMonth = dashboardData.profitMonth;

new Chart(document.getElementById("profitMonth"), {
    type: "line",
    data: {
        labels: profitMonth.map(item => item.month),
        datasets: [
            {
                label: "Lucro",
                data: profitMonth.map(item => item.profit),
                tension: 0.3,
                fill: true,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,

        scales: {
            x: {
                title: {
                    display: true,
                    text: "Mês",
                },
            },

            y: {
                title: {
                    display: true,
                    text: "Lucro",
                },

                ticks: {
                    callback: function (value) {
                        return "$ " + value.toLocaleString("en-US");
                    },
                },
            },
        },

        plugins: {
            legend: {
                display: false,
            },

            tooltip: {
                callbacks: {
                    label: function (context) {
                        return "$ " + context.parsed.y.toLocaleString(
                            "en-US",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }
                        );
                    },
                },
            },
        },
    },
});

// ============================================================
// Ticket médio
// ============================================================
const ticketMonth = dashboardData.ticketMonth;

new Chart(document.getElementById("ticketMonth"), {
    type: "line",

    data: {
        labels: ticketMonth.map(item => item.month),

        datasets: [{
            label: "Ticket médio",
            data: ticketMonth.map(item => item.average_ticket),
            tension: 0.3,
            fill: true,
        }],
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        scales: {
            x: {
                title: {
                    display: true,
                    text: "Mês",
                },
            },

            y: {
                title: {
                    display: true,
                    text: "Ticket médio",
                },

                ticks: {
                    callback: function (value) {
                        return "$ " + value.toLocaleString("en-US");
                    },
                },
            },
        },

        plugins: {
            legend: {
                display: false,
            },

            tooltip: {
                callbacks: {
                    label: function (context) {
                        return "$ " + context.parsed.y.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        });
                    },
                },
            },
        },
    },
});