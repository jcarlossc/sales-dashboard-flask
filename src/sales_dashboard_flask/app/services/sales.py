import pandas as pd


def get_sales(df: pd.DataFrame) -> dict:
    """
    Calcula as principais métricas de vendas.

    Args:
        df: DataFrame contendo as vendas.

    Returns:
        Dicionário com as métricas.
    """

    # Faturamento total
    df["gross_revenue"] = df["Quantity"] * df["Unit_Price"]

    # KPIs
    gross_revenue = df["gross_revenue"].sum()
    sales_quantity = len(df)
    profit_margin = (df["Profit"].sum() / df["gross_revenue"].sum()) * 100
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

    # Gráfico: vendas por produto
    sales_products = (
        df.groupby("Product_Name")["gross_revenue"]
        .sum()
        .sort_values(ascending=False)
        .head(15)
        .reset_index()
        .to_dict(orient="records")
    )

    # Gráfico: vendas por região
    sales_regions = (
        df.groupby("Region", as_index=False)["gross_revenue"]
        .sum()
        .sort_values("gross_revenue", ascending=False)
        .to_dict(orient="records")
    )

    # Gráfico: vendas por método de pagamento
    sales_payment_methods = (
        df.groupby("Payment_Method", as_index=False)["gross_revenue"]
        .sum()
        .sort_values("gross_revenue", ascending=False)
        .to_dict(orient="records")
    )

    # Gráfico: vendas por categoria
    sales_categories = (
        df.groupby("Product_Category", as_index=False)["gross_revenue"]
        .sum()
        .sort_values("gross_revenue", ascending=False)
        .to_dict(orient="records")
    )

    return {
        "cards": {
            "gross_revenue": gross_revenue,
            "sales_quantity": sales_quantity,
            "profit_margin": profit_margin,
            "average_ticket": average_ticket,
        },
        "charts": {
            "sales_month": sales_month,
            "sales_products": sales_products,
            "sales_regions": sales_regions,
            "sales_payment_methods": sales_payment_methods,
            "sales_categories": sales_categories,
        },
    } 