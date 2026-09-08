from flask import Flask 
# Registra as rotas da aplicação. 
from sales_dashboard.app.routes.routes import main 


def create_app() -> Flask: 
    """ 
    Cria e configura a aplicação Flask. 
    Returns: Flask: Instância da aplicação Flask. 
    Raises: RuntimeError: Se ocorrer erro durante a criação da aplicação. 
    """ 
    try: 
        app = Flask(__name__) 

        app.register_blueprint(main) 

        return app 
    
    except Exception as exc: 
        raise RuntimeError(
            "Erro ao criar a aplicação Flask." 
        ) from exc

def run() -> None:
    """Executa a aplicação Flask em modo de desenvolvimento."""

    app = create_app()

    app.run(
        debug=True,
    )          