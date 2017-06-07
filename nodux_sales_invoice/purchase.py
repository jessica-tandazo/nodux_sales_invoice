from __future__ import unicode_literals
import frappe
import json
import copy
from frappe import throw, _
from frappe.utils import flt, cint
from frappe import _
from frappe.model.document import Document

def validate(doc, event):

    if doc.dias_1 and not doc.dias_2 and not doc.dias_3 and not doc.dias_4:
        print "MENSAJE 1"
        for field in ["Termino de Pago"]:
            if (doc.get(frappe.scrub(field))) != "":
                for field in ["Dias 1",]:
                    if float(doc.get(frappe.scrub(field))) <= 0:
                        throw(_("{0} can not be negative").format(field))
                    else:
                        a = float(doc.get(frappe.scrub(field)))
                        if doc.termino_de_pago:
                            termino_de_pago = doc.termino_de_pago
                            numero_dias = frappe.db.get_value("Termino de Pago",{"termino_de_pago": termino_de_pago}, "numero_dias")
                            if a > numero_dias:
                                nuevo_valor = frappe.db.sql("""select termino_de_pago from `tabTermino de Pago`
                        			where numero_dias >= %s""",
                        			    (a), as_dict = 1)
                                if not nuevo_valor:
                                    frappe.throw(_("Termino de Pago {0} is not active").format(a))
                                else:
                                    nuevo_valor = nuevo_valor[0]
                                    doc.termino_de_pago = nuevo_valor.termino_de_pago

    if doc.dias_1 and doc.dias_2 and not doc.dias_3 and not doc.dias_4:
        print "MENSAJE 2"
        for field in ["Termino de Pago"]:
            if (doc.get(frappe.scrub(field))) != "":
                for field in ["Dias 2",]:
                    if float(doc.get(frappe.scrub(field))) <= 0:
                        throw(_("{0} can not be negative").format(field))
                    else:
                        a = float(doc.get(frappe.scrub(field)))
                        if doc.termino_de_pago:
                            termino_de_pago = doc.termino_de_pago
                            numero_dias = frappe.db.get_value("Termino de Pago",{"termino_de_pago": termino_de_pago}, "numero_dias")
                            if a > numero_dias:
                                nuevo_valor = frappe.db.sql("""select termino_de_pago from `tabTermino de Pago`
                        			where numero_dias >= %s""",
                        			    (a), as_dict = 1)
                                if not nuevo_valor:
                                    frappe.throw(_("Termino de Pago {0} is not active").format(a))
                                else:
                                    nuevo_valor = nuevo_valor[0]
                                    doc.termino_de_pago = nuevo_valor.termino_de_pago
    if doc.dias_1 and doc.dias_2 and doc.dias_3 and not doc.dias_4:
        print "MENSAJE 3"
        for field in ["Termino de Pago"]:
            if (doc.get(frappe.scrub(field))) != "":
                for field in ["Dias 3",]:
                    if float(doc.get(frappe.scrub(field))) <= 0:
                        throw(_("{0} can not be negative").format(field))
                    else:
                        a = float(doc.get(frappe.scrub(field)))
                        if doc.termino_de_pago:
                            termino_de_pago = doc.termino_de_pago
                            numero_dias = frappe.db.get_value("Termino de Pago",{"termino_de_pago": termino_de_pago}, "numero_dias")
                            if a > numero_dias:
                                nuevo_valor = frappe.db.sql("""select termino_de_pago from `tabTermino de Pago`
                        			where numero_dias >= %s""",
                        			    (a), as_dict = 1)
                                if not nuevo_valor:
                                    frappe.throw(_("Termino de Pago {0} is not active").format(a))
                                else:
                                    nuevo_valor = nuevo_valor[0]
                                    doc.termino_de_pago = nuevo_valor.termino_de_pago
    if doc.dias_1 and doc.dias_2 and doc.dias_3 and doc.dias_4:
        print "MENSAJE 4"
        for field in ["Termino de Pago"]:
            if (doc.get(frappe.scrub(field))) != "":
                for field in ["Dias 4",]:
                    if float(doc.get(frappe.scrub(field))) <= 0:
                        throw(_("{0} can not be negative").format(field))
                    else:
                        a = float(doc.get(frappe.scrub(field)))
                        if doc.termino_de_pago:
                            termino_de_pago = doc.termino_de_pago
                            numero_dias = frappe.db.get_value("Termino de Pago",{"termino_de_pago": termino_de_pago}, "numero_dias")
                            if a > numero_dias:
                                nuevo_valor = frappe.db.sql("""select termino_de_pago from `tabTermino de Pago`
                        			where numero_dias >= %s""",
                        			    (a), as_dict = 1)
                                if not nuevo_valor:
                                    frappe.throw(_("Termino de Pago {0} is not active").format(a))
                                else:
                                    nuevo_valor = nuevo_valor[0]
                                    doc.termino_de_pago = nuevo_valor.termino_de_pago

    # if doc.referencia_de_proveedor:
    #     frappe.set_value("Purchase Invoice", "Purchase Invoice", "referencia", doc.referencia_de_proveedor);
