from flask import Blueprint, render_template, request

from sales_dashboard_flask.app.services.load_sales import load_sales_data

main = Blueprint("main", __name__)

@main.route("/")
def dashboard():

    try:
        df = load_sales_data()
        
        dashboard_data = {}

        return render_template(
            "index.html",
            dashboard_data=dashboard_data,
        )

    except Exception as exc: 
        raise RuntimeError( 
            f"Erro ao renderizar o dashboard: {exc}" 
        ) from exc