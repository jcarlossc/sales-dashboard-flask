import pandas as pd


def get_sales(df: pd.DataFrame) -> dict:
    """
    Calcula as principais métricas do dashboard.

    Args:
        df: DataFrame contendo as vendas.

    Returns:
        Dicionário com as métricas.
    """

    # Faturamento por venda
    df["gross_revenue"] = df["Quantity"] * df["Unit_Price"]

    # KPIs
    gross_revenue = df["gross_revenue"].sum()
    sales_quantity = len(df)
    total_products = df["Product_Name"].nunique()
    average_ticket = gross_revenue / sales_quantity

    # Vendas por mês
    df["sales_month"] = pd.to_datetime(df["Order_Date"])
    df["month"] = df["sales_month"].dt.to_period("M").astype(str)
    sales_month = (
        df.groupby("month")["gross_revenue"]
        .sum()
        .reset_index()
        .to_dict(orient="records")
    )

    return {
        "cards": {
            "gross_revenue": gross_revenue,
            "sales_quantity": sales_quantity,
            "total_products": total_products,
            "average_ticket": average_ticket,
        },
        "charts": {
            "sales_month": sales_month,
        },
    } 