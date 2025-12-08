from langchain_core.tools import tool

@tool
def lookup_invoice(invoice_id: str) -> str:
    """Lookup invoice details by ID."""
    if invoice_id == "INV-123":
        return "Invoice INV-123: Paid, Amount: $500, Date: 2023-10-01"
    elif invoice_id == "INV-456":
        return "Invoice INV-456: Pending, Amount: $150, Date: 2023-10-05"
    else:
        return f"Invoice {invoice_id} not found."

@tool
def query_manual(device_model: str) -> str:
    """Query technical manual for a device model."""
    if "router" in device_model.lower():
        return "To reset the router, hold the reset button for 10 seconds."
    elif "modem" in device_model.lower():
        return "Ensure the coaxial cable is tightly connected."
    else:
        return f"No manual found for {device_model}."
