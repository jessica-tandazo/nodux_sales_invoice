var s = "";
frappe.ui.form.on('Purchase Invoice', {
  onload: function(frm){
    var me = this;
		if (!frm.doc.status)
			frm.doc.status = 'Draft';
		frm.refresh_fields();
  },
  refresh: function(frm){
    if (frm.doc.status == 'Draft') {
			frm.add_custom_button(__("Pagar"), function() {
        if (cint(frm.doc.no_genera_retencion)) {
          msgprint("No se va a generar retención");
        } else {
          frm.events.present_jdialog(frm);
        }
			}).addClass("btn-primary");
		}
  },

  present_jdialog: function(frm) {
    var supplier = "";
    var date = "";
    var referencia="";

    supplier = frm.doc.supplier;
    date = frm.doc.posting_date;
    referencia = frappe.db.get_value("Purchase Order", {"supplier": supplier, "transaction_date":date}, "referencia_de_proveedor",function(r){
      if (referencia!=null) {
        s = r.referencia_de_proveedor;
      }else{
        msgprint("No hay un valor de referencia para esta orden de venta")
      }
    })
    msgprint("VALOR DE REF: "+ s);
    var d = new frappe.ui.Dialog({
			title: __("Retención"),

			fields: [
				{"fieldname":"tipo", "fieldtype":"Select", "label":__("Tipo"),
					options:"Retención a Proveedor", "default": "Retencion a Proveedor"},
				{"fieldname":"proveedor", "fieldtype":"Link", "label":__("Proveedor 1"),
					label:"Proveedor", reqd: 1, "default":frm.doc.supplier},
        {"fieldname":"efectivo", "fieldtype":"Check", "label":__("Check"),
          label:"Efectivo", "default": 1},
        {"fieldname":"fecha_retencion","fieldtype":"Date",label:"Fecha de Retención",
          reqd: 1,"default":frappe.datetime.nowdate()},
        {"fieldname":"numero_factura", "fieldtype":"Data", "label":__("Número de Factura"),
          label:"Número de Factura", reqd: 1,"default": "001-001-"},
        {"fieldname":"coulmn_break","fieldtype":"Column Break"},
        {"fieldname":"numero", "fieldtype": "Data", "label":__("Número"),
          label:"Número"},
        {"fieldname":"referencia", "fieldtype": "Link", "label":__("Referencia"),
          label:"Referencia", reqd: 1, "default": "001-001-"+ s},
        {"fieldname":"libro_diario", "fieldtype": "Link", "label":__("Libro Diario"),
          label:"Libro Diario"},
        {"fieldname":"moneda","fieldtype":"Link","label":__("Moneda"),label:"Moneda",
          options: "Currency", "default":"USD"},
        {"fieldname":"section_break","fieldtype":"Section Break"},
        // {"fieldname":"table_impuestos","fieldtype":"Table",label:"Impuestos"},
        {"fieldname":"coulmn_break_1","fieldtype":"Column Break"},
        {"fieldname":"base_imponible","fieldtype":"Currency","label":__("Base Imponible"),
          label:"Valor Base Imponible"},
        {"fieldname":"impuesto","fieldtype":"Currency","label":__("Impuesto"),
          label:"Valor Impuesto"},
        {"fieldname":"total_retencion","fieldtype":"Currency","label":__("Total Retención"),
          label:"Total Retención"},
        {"fieldname":"section_break_1","fieldtype":"Section Break"},
				//{fieldname:"confirm", "label":__("Confirm"), "fieldtype":"Button"},
        // {"fieldname":"coulmn_break_2","fieldtype":"Column Break"},
         {fieldname:"confirm", "label":__("Confirm"), "fieldtype":"Button"}]
		});

		d.get_input("confirm").on("click", function() {
			var values = d.get_values();
			if(!values) return;
			if(values["referencia"] == "001-001-" ) frappe.throw("Ingrese el número de referencia de la orden de compra");
      if(values["proveedor"] != frm.doc.supplier ) frappe.throw("No coinciden los datos del nombre del proveedor");
			if(values["total"] > frm.doc.total) frappe.throw("Monto a pagar no puede ser mayor al monto total de venta");
			// return frappe.call({
			// 	doc: frm.doc,
			// 	method: "update_to_pay_sale",
			// 	args: values,
			// 	freeze: true,
			// 	callback: function(r) {
			// 		var row = frm.add_child("payments");
			// 		row.amount = values["total"];
			// 		row.date = frappe.datetime.nowdate();
			// 		d.hide();
			// 		frm.refresh_fields();
			// 		frm.refresh();
			// 	}
			// })
		});
		refresh_field("payments");
		d.show();
		frm.refresh_fields();
		frm.refresh();
  },
  update_to_pay_sale: function(frm) {
    var d = new frappe.ui.Dialog({
			title: __("Payment"),
			fields: [
				{"fieldname":"customer", "fieldtype":"Link", "label":__("Customer"),
					options:"Customer", reqd: 1, label:"Customer", "default":frm.doc.customer_name},
				{"fieldname":"total", "fieldtype":"Currency", "label":__("Total Amount"),
					label:"Total Amount", "default":frm.doc.total},
				{fieldname:"pay", "label":__("Pay"), "fieldtype":"Button"}]
		});

		// d.get_input("pay").on("click", function() {
		// 	var values = d.get_values();
		// 	if(!values) return;
		// 	if(values["total"] < 0) frappe.throw("Ingrese monto a pagar");
		// 	if(values["total"] > frm.doc.total) frappe.throw("Monto a pagar no puede ser mayor al monto total de venta");
		// 	return frappe.call({
		// 		doc: frm.doc,
		// 		method: "update_to_pay_sale",
		// 		args: values,
		// 		freeze: true,
		// 		callback: function(r) {
		// 			var row = frm.add_child("payments");
		// 			row.amount = values["total"];
		// 			row.date = frappe.datetime.nowdate();
		// 			d.hide();
		// 			frm.refresh_fields();
		// 			frm.refresh();
		// 		}
		// 	})
		// });
		refresh_field("payments");
		d.show();
		frm.refresh_fields();
		frm.refresh();
	}
});
