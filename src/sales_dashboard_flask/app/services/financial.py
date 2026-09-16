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

    # Gráfico de pedidos pos nmês
    df["Order_Date"] = pd.to_datetime(df["Order_Date"])
    orders_by_month = (
        df.assign(
            month=df["Order_Date"].dt.to_period("M").astype(str)
        )
        .groupby("month")["Order_ID"]
        .nunique()
        .reset_index(name="orders")
        .to_dict(orient="records")
    )

    # Gráfico de desconto por lucro
    discount_profit = (
        df.assign(
            discount=df["gross_revenue"] - df["Total_Sales"]
        )[["Discount_Percent", "Profit"]]
        .rename(columns={"Profit": "profit"})
        .to_dict(orient="records")
    )

    # Gráfico de frete × receita
    shipping_revenue = (
        df[["Shipping_Cost", "Total_Sales"]]
        .rename(
            columns={
                "Shipping_Cost": "shipping_cost",
                "Total_Sales": "revenue",
            }
        )
        .to_dict(orient="records")
    )

    # Gráfico de custo e lucro ao longo do tempo
    financial_by_month = (
        df.assign(
            month=df["Order_Date"]
            .dt.to_period("M")
            .astype(str)
        )
        .groupby("month", as_index=False)
        .agg(
            revenue=("Total_Sales", "sum"),
            cost=("Shipping_Cost", "sum"),
            profit=("Profit", "sum"),
        )
        .to_dict(orient="records")
    )

    return {
        "cards": {
            "total_shipping_cost": total_shipping_cost,
            "total_profit": total_profit,
            "total_discount": total_discount,
            "cost_per_unit": cost_per_unit,
        },
        "charts": {
            "orders_by_month": orders_by_month,
            "discount_profit": discount_profit,
            "shipping_revenue": shipping_revenue,
            "financial_by_month": financial_by_month,
        },
    } 