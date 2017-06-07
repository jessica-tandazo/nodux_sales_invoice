from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe import _, throw
from frappe.utils import cint, flt
import frappe.defaults
#from nodux_sales_invoice.delivery_note.delivery import *

class DeliveryNote(Document):
    pass
    # def before_save(self):
    #     self.docstatus = 1
    #     for item in self.items:
    #         if item.item_code:
    #             product = frappe.get_doc("Item", item.item_code)
    #             if product.total<0:
    #                 frappe.throw(("El producto {0} no se encuentra disponible en stock").format(item.item_name))
    #             elif product.total < item.qty:
    #                 frappe.throw(("No cuenta con suficiente stock del producto {0}").format(item.item_name))
    #             else:
    #                 product.total = product.total-item.qty
    #                 product.save()


@frappe.whitelist()
def get_item_code_sale(item_code):
    #print "VALOR ARGS:", item_code
    item = frappe.db.sql("""select item_name,barcode,description,stock_uom,selling_price from `tabItem`
        where item_code = %s""",
        (item_code), as_dict = 1)

    if not item:
        frappe.throw(_("Item {0} doesn't have a defined price").format(item_code))
    item = item[0]
    print "ITEM", item
    ret ={
		'item_name' 		  	: item.item_name,
        'barcode'				: item.barcode,
        'description'		  	: item.description,
        'stock_uom'			    : item.stock_uom,
		'qty'					: 1,
		'unit_price'			: item.selling_price,
		'unit_price_with_no_dcto'	: item.selling_price,
		'subtotal'				: item.selling_price
    }
    return ret

@frappe.whitelist()
def get_it(salary):
    ss = salary
    return ss
        # if self.pricing_rule:
        #     rule = self.pricing_rule
        #     porcentaje = frappe.db.get_value("Pricing Rule", {"title":("like rule")}, "margin_rate_or_amount")
        #     item = frappe.db.sql("""select price_list_rate from `tabItem Price`
        #         where item_code = %s""",
        #             (args.get('item_code')), as_dict = 1)
        #     if not item:
        #         frappe.throw(_("Item {0} doesn't have a defined price").format(args.get("item_code")))
        #
        #     item = item[0]
        #     precio_unit = item * (1 + porcentaje/100)
        #
        #             #item = item[0]
        #     ret = {
        #         "barcode"               : 123,
        #         "item_name"             : "prod_1",
        #         "qty"                   : 1,
        #         "stock_uom"             : 1,
        #         'discount_percentage'   : 1
        #                 # 'description'		  	: item.description,
        #                 # 'item_name' 		  	: item.item_name,
        #                 # 'qty'					: 1,
        #                 # 'barcode'				: item.barcode,
        #                 # 'unit_price'			: item.list_price,
        #                 # 'unit_price_with_tax'	: item.list_price_with_tax,
        #                 # 'subtotal'				: item.list_price_with_tax
        #         }
        #
        #     return ret
        # else:
        #     throw(_("Debe elegir una regla de precios"))
