from __future__ import unicode_literals
import frappe
import json
import copy
from frappe import throw, _
from frappe.utils import flt, cint
from frappe import _
from frappe.model.document import Document

def validate(doc, event):
    if cint(doc.no_genera_retencion):
        print "NO GENERA"
