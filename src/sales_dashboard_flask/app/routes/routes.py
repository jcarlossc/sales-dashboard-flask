from flask import Blueprint, render_template, request

main = Blueprint("main", __name__)

@main.route("/")
def dashboard():

    try:
        dashboard_data = {}

        return render_template(
            "index.html",
            dashboard_data=dashboard_data,
        )

    except Exception as exc: 
        raise RuntimeError( 
            f"Erro ao renderizar o dashboard: {exc}" 
        ) from exc