from __future__ import unicode_literals
import frappe
import json
import copy
from frappe import throw, _
from frappe.utils import flt, cint
from frappe import _
from frappe.model.document import Document
from frappe.model.mapper import get_mapped_doc
from frappe import msgprint, _

def validate(doc, event):
    if cint(doc.no_genera_retencion):
        print "NO GENERA"

@frappe.whitelist()
def make_purchase_invoice_prueba(source_name, target_doc=None):
    def postprocess(source, target):
        set_missing_values(source, target)
        #Get the advance paid Journal Entries in Purchase Invoice Advance
        target.set_advances()

    def update_item(obj, target, source_parent):
        # target.amount = flt(obj.amount) - flt(obj.billed_amt)
        # target.base_amount = target.amount * flt(source_parent.conversion_rate)
        # target.qty = target.amount / flt(obj.rate) if (flt(obj.rate) and flt(obj.billed_amt)) else flt(obj.qty)
        target.qty = flt(obj.qty)

        # item = frappe.db.get_value("Item", target.item_code, ["item_group", "buying_cost_center"], as_dict=1)
        item = frappe.db.get_value("Item", target.item_code, ["cost_price"], as_dict=1)
        print "ITEM", item


        # target.cost_center = frappe.db.get_value("Project", obj.project, "cost_center") \
        #     or item.buying_cost_center \
        #     or frappe.db.get_value("Item Group", item.item_group, "default_cost_center")

    doc = get_mapped_doc("Purchase Order", source_name,	{
        "Purchase Order": {
            "doctype": "Purchase Invoice",
            "validation": {
                "docstatus": ["=", 1],
            }
        },

        "Purchase Order Item": {
            "doctype": "Purchase Invoice Item",
            "field_map": {
                "name": "po_detail",
                "parent": "purchase_order",
            },
            "postprocess": update_item
            # "condition": lambda doc: (doc.base_amount==0 or abs(doc.billed_amt) < abs(doc.amount))
            }
        #     "Purchase Taxes and Charges": {
        #         "doctype": "Purchase Taxes and Charges",
        #         "add_if_empty": True
        #     }
        }, target_doc, postprocess)

    return doc

def set_missing_values(source, target):
	target.ignore_pricing_rule = 1
	target.run_method("set_missing_values")
	target.run_method("calculate_taxes_and_totals")

@frappe.whitelist()
def update_taxes(iva)
    print "VALOR ARGS:", iva
    imp = frappe.db.sql("""select percentage from `tabImpuesto`
        where naming_series = %s""",
        (iva), as_dict = 1)

    if not imp:
        frappe.throw(_("Impuesto {0} doesn't have a defined percentage").format(iva))
    item = item[0]

    ret ={
		'total_retencion' 		  	: imp.percentage
    }
    return ret
