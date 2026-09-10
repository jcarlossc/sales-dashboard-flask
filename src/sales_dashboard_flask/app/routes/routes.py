from flask import Blueprint, render_template, request

from sales_dashboard_flask.app.services.load_sales import load_sales_data
from sales_dashboard_flask.app.services.sales import get_sales

main = Blueprint("main", __name__)

@main.route("/")
def dashboard():

    try:
        df = load_sales_data()

        section = request.args.get("section", "sales")

        dashboard_data = {}

        # Seleciona as métricas conforme a seção
        if section == "sales":
            sales = get_sales(df)

            dashboard_data = {
                "grossRevenue": sales["cards"]["gross_revenue"],
                "salesQuantity": sales["cards"]["sales_quantity"],
                "profitMargin": sales["cards"]["profit_margin"],
                "averageTicket": sales["cards"]["average_ticket"],
                "salesMonth": sales["charts"]["sales_month"],
            }

        elif section == "financial":
            pass

        elif section == "temporal":
            pass

        elif section == "regional":
            pass

        elif section == "customer":
            pass

        elif section == "products":
            pass

        else:
            # Seção inválida
            section = "sales"

            sales = get_sales(df)

            dashboard_data = {
                "grossRevenue": sales["cards"]["gross_revenue"],
                "salesQuantity": sales["cards"]["sales_quantity"],
                "profitMargin": sales["cards"]["profit_margin"],
                "averageTicket": sales["cards"]["average_ticket"],
                "salesMonth": sales["charts"]["sales_month"],
            }

        return render_template(
            "index.html",
            dashboard_data=dashboard_data,
        )

    except Exception as exc: 
        raise RuntimeError( 
            f"Erro ao renderizar o dashboard: {exc}" 
        ) from exc