from flask import Blueprint, render_template, request

from sales_dashboard_flask.app.services.load_sales import load_sales_data
from sales_dashboard_flask.app.services.sales import get_sales
from sales_dashboard_flask.app.services.financial import get_financial

main = Blueprint("main", __name__)

@main.route("/")
def dashboard():
    """Renderiza o dashboard com os dados de todas as seções."""

    try:
        df = load_sales_data()

        sales = get_sales(df)
        financial = get_financial(df)

        dashboard_data = {
            # =========================
            # VENDAS
            # =========================
            "grossRevenue": sales["cards"]["gross_revenue"],
            "salesQuantity": sales["cards"]["sales_quantity"],
            "profitMargin": sales["cards"]["profit_margin"],
            "averageTicket": sales["cards"]["average_ticket"],
            "salesMonth": sales["charts"]["sales_month"],
            "salesProducts": sales["charts"]["sales_products"],
            "salesRegions": sales["charts"]["sales_regions"],
            "salesPaymentMethods": sales["charts"]["sales_payment_methods"],
            "salesCategories": sales["charts"]["sales_categories"],

            # =========================
            # FINANCEIRO
            # =========================
            "totalShippingCost": financial["cards"]["total_shipping_cost"],
            "totalProfit": financial["cards"]["total_profit"],
            "totalDiscount": financial["cards"]["total_discount"],
            "costPerUnit": financial["cards"]["cost_per_unit"],
            "ordersByMonth": financial["charts"]["orders_by_month"],
            "discountProfit": financial["charts"]["discount_profit"],
            "shippingRevenue": financial["charts"]["shipping_revenue"],
            "financialByMonth": financial["charts"]["financial_by_month"],
        }

        return render_template(
            "index.html",
            dashboard_data=dashboard_data,
        )

    except Exception as exc:
        raise RuntimeError(
            f"Erro ao renderizar o dashboard: {exc}"
        ) from exc