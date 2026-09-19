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

        # Índice de sazonalidade.
        monthly["seasonality_index"] = (
            monthly["sales"] / average_monthly_sales
        )

        # Gráfico de faturamento anual
        monthly_sales = (
            data
            .groupby(data["Order_Date"].dt.year)["Total_Sales"]
            .sum()
            .sort_index()
        )

        sales_year = [
            {
                "year": int(year),
                "sales": float(sales),
            }
            for year, sales in monthly_sales.items()
        ]

        # Gráfico de lucro por mês
        monthly_profit = (
            data
            .groupby(data["Order_Date"].dt.to_period("M"))["Profit"]
            .sum()
            .sort_index()
        )

        month_names = {
            1: "Jan",
            2: "Fev",
            3: "Mar",
            4: "Abr",
            5: "Mai",
            6: "Jun",
            7: "Jul",
            8: "Ago",
            9: "Set",
            10: "Out",
            11: "Nov",
            12: "Dez",
        }

        profit_month = [
            {
                "month": f"{month_names[period.month]}/{period.year}",
                "profit": float(value),
            }
            for period, value in monthly_profit.items()
        ]

        # Ticket médio por mês
        monthly_ticket = (
            data
            .groupby(data["Order_Date"].dt.to_period("M"))
            .agg(
                revenue=("Total_Sales", "sum"),
                orders=("Order_ID", "nunique"),
            )
        )

        monthly_ticket["average_ticket"] = (
            monthly_ticket["revenue"] / monthly_ticket["orders"]
        )

        month_names = {
            1: "Jan",
            2: "Fev",
            3: "Mar",
            4: "Abr",
            5: "Mai",
            6: "Jun",
            7: "Jul",
            8: "Ago",
            9: "Set",
            10: "Out",
            11: "Nov",
            12: "Dez",
        }

        ticket_month = [
            {
                "month": f"{month_names[period.month]}/{period.year}",
                "average_ticket": float(row["average_ticket"]),
            }
            for period, row in monthly_ticket.iterrows()
        ]

        return {
            "cards": {
                "average_monthly_sales": float(average_monthly_sales),
                "best_month": str(best_month),
                "worst_month": str(worst_month),
                "sales_range": float(sales_range),
            },
            "charts": {
                "sales_year": sales_year,
                "profit_month": profit_month,
                "ticket_month": ticket_month,
            }
        }

    except (KeyError, TypeError, ValueError) as error:
        raise ValueError(
            "Não foi possível calcular a análise temporal."
        ) from error