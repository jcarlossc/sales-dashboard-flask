from pathlib import Path

import pandas as pd


# Caminho raiz do projeto.
PROJECT_ROOT = Path(__file__).resolve().parents[4]

# Diretório onde estão os dados brutos.
DATA_PATH = PROJECT_ROOT / "data"


def load_sales_data() -> pd.DataFrame:
    """
    Carrega os dados brutos de vendas.

    Procura um arquivo CSV no diretório data/data_raw
    e retorna os dados como um DataFrame do pandas.

    Returns:
        pd.DataFrame: Dados de vendas carregados.

    Raises:
        FileNotFoundError: Se o diretório ou arquivo não existir.
        ValueError: Se nenhum CSV for encontrado ou o arquivo estiver vazio.
        RuntimeError: Se ocorrer um erro inesperado durante a leitura.
    """

    try:
        # Verifica se o diretório de dados existe.
        if not DATA_PATH.exists():
            raise FileNotFoundError(
                f"Diretório não encontrado: {DATA_PATH}"
            )

        # Procura arquivos CSV.
        csv_files = list(DATA_PATH.glob("*.csv"))

        if not csv_files:
            raise ValueError(
                f"Nenhum arquivo CSV encontrado em: {DATA_PATH}"
            )

        # Nesta primeira etapa, utiliza o primeiro CSV encontrado.
        file_path = csv_files[0]

        # Carrega os dados.
        df = pd.read_csv(file_path)

        # Impede que um arquivo vazio seja utilizado.
        if df.empty:
            raise ValueError(
                f"O arquivo CSV está vazio: {file_path}"
            )  

        return df

    except (FileNotFoundError, ValueError):
        # Mantém os erros de validação originais.
        raise

    except Exception as exc:
        # Converte erros inesperados em um erro da aplicação.
        raise RuntimeError(
            f"Erro ao carregar os dados de vendas: {exc}"
        ) from exc