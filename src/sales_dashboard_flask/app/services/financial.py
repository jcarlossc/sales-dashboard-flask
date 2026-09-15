import pandas as pd


def get_financial(df: pd.DataFrame) -> dict:
    """
    Calcula as principais métricas do financeiras.

    Args:
        df: DataFrame contendo as vendas.

    Returns:
        Dicionário com as métricas.
    """

    # Faturamento total
    df["gross_revenue"] = df["Quantity"] * df["Unit_Price"]

    # KPIs
    total_shipping_cost = df["Shipping_Cost"].sum()
    total_profit = df["Profit"].sum()
    total_discount = (df["gross_revenue"] - df["Total_Sales"]).sum()
    cost_per_unit = df["Shipping_Cost"].sum() / df["Quantity"].sum()

    return {
        "cards": {
            "total_shipping_cost": total_shipping_cost,
            "total_profit": total_profit,
            "total_discount": total_discount,
            "cost_per_unit": cost_per_unit,
        },
    } 