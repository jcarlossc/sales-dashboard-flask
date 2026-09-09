from flask import Blueprint, render_template, request

main = Blueprint("main", __name__)

@main.route("/")
def dashboard():

    try:
        teste = "TESTANDO TEMPLATE"

        return render_template(
            "index.html",
            teste=teste,
        )

    except Exception as exc: 
        raise RuntimeError( 
            f"Erro ao renderizar o dashboard: {exc}" 
        ) from exc