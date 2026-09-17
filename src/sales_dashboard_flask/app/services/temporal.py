import pandas as pd


def get_temporal(df: pd.DataFrame) -> dict:
    """
    Calcula métricas de análise temporal das vendas.

    Args:
        df: DataFrame contendo os dados de vendas.

    Returns:
        Dicionário contendo as principais métricas temporais.
    """
    try:
        data = df.copy()

        # Garante que Order_Date seja datetime.
        data["Order_Date"] = pd.to_datetime(data["Order_Date"])

        # Cria período mensal.
        data["Year_Month"] = data["Order_Date"].dt.to_period("M")

        # Agregação mensal.
        monthly = (
            data.groupby("Year_Month")
            .agg(
                sales=("Total_Sales", "sum"),
                profit=("Profit", "sum"),
                orders=("Order_ID", "nunique"),
            )
            .sort_index()
        )

        # Crescimento mensal do faturamento.
        monthly["sales_mom"] = monthly["sales"].pct_change() * 100

        # Crescimento mensal do lucro.
        monthly["profit_mom"] = monthly["profit"].pct_change() * 100

        # Crescimento mensal dos pedidos.
        monthly["orders_mom"] = monthly["orders"].pct_change() * 100

        # Média mensal de faturamento.
        average_monthly_sales = monthly["sales"].mean()

        # Melhor e pior mês.
        best_month = monthly["sales"].idxmax()
        worst_month = monthly["sales"].idxmin()

        # Amplitude entre o melhor e o pior mês.
        sales_range = monthly["sales"].max() - monthly["sales"].min()

        # Volatilidade mensal.
        sales_std = monthly["sales"].std()

        # Coeficiente de variação.
        sales_cv = (
            sales_std / average_monthly_sales * 100
            if average_monthly_sales != 0
            else 0
        )

        # Índice de sazonalidade.
        monthly["seasonality_index"] = (
            monthly["sales"] / average_monthly_sales
        )

        return {
            "cards": {
                "average_monthly_sales": float(average_monthly_sales),
                "best_month": str(best_month),
                "worst_month": str(worst_month),
                "sales_range": float(sales_range),
            },
        }

    except (KeyError, TypeError, ValueError) as error:
        raise ValueError(
            "Não foi possível calcular a análise temporal."
        ) from error