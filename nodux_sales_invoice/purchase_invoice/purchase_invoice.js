var total_ret = 0;
var iva = "";
var impuesto_fuente = "";
var ret_iva = 0;
var ret_imp = 0;
frappe.ui.form.on('Purchase Invoice', {
  onload: function(frm){
		if (!frm.doc.status){
      frm.doc.status = 'Draft';
		  frm.refresh_fields();
    }
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


    var referencia="";
    var porc_iva = "";
    var porc_imp = "";
    var impuesto = "";
    var base_imp = "";


    referencia = frm.doc.referencia_de_proveedor;
    supplier = frm.doc.supplier;
    impuesto = frm.doc.impuesto;
    base_imp = frm.doc.base_imponible;

    //Búsqueda del impuesto IVA del proveedor
    frappe.db.get_value("Supplier", {"supplier_name": supplier}, "iva", function(r){
      iva = r.iva;
      if (iva != "" ) {
        frappe.db.get_value("Impuesto", {"imp_name": iva}, "percentage", function(r){
          porc_iva = r.percentage;
          if (porc_iva != null) {
            ret_iva = impuesto * (porc_iva/100);
            // frm.set_value("ret_iva", ret_iva);
            // var a = frm.doc.ret_iva;
          }else{
            alert("No hya valor de retencion");
          }
        })
      }else{
        msgprint("Este proveedor no tiene configurado el IVA en la retención... Debe configurar primero");
      }
    })
    //Búsqueda del impuesto fuente del proveedor
    frappe.db.get_value("Supplier", {"supplier_name": supplier}, "impuesto_fuente",function(r){
      impuesto_fuente = r.impuesto_fuente;
      if (impuesto_fuente != "") {
        frappe.db.get_value("Impuesto", {"imp_name": impuesto_fuente}, "percentage",function(r){
          porc_imp = r.percentage;
          if (porc_imp != null) {
            ret_imp = base_imp * (porc_imp/100);
            // frm.set_value("ret_impuesto", ret_imp);
            // var b=frm.doc.ret_impuesto;
            total_ret = ret_iva + ret_imp;
          }
        })
      }else{
        msgprint("Este proveedor no tiene configurado el impuesto fuente en la retención... Debe configurar primero");
      }
    })

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
          label:"Referencia", reqd: 1, "default": "001-001-"+ referencia},
        {"fieldname":"libro_diario", "fieldtype": "Link", "label":__("Libro Diario"),
          label:"Libro Diario"},
        {"fieldname":"moneda","fieldtype":"Link","label":__("Moneda"),label:"Moneda",
          options: "Currency", "default":"USD"},
        {"fieldname":"section_break_1","fieldtype":"Section Break", label:"Impuestos"},
        {"fieldname":"iva","fieldtype":"Link","label":__("IVA"),
          label:"IVA", options: "Impuesto", "default": iva},
        {"fieldname":"impuesto_fuente","fieldtype":"Link","label":__("Impuesto Fuente"),
            label:"Impuesto Fuente", options: "Impuesto", "default": impuesto_fuente },
        {"fieldname":"coulmn_break_2","fieldtype":"Column Break"},
        {"fieldname":"ret_iva","fieldtype":"Currency","label":__("Valor Iva"),
          label:"Valor Retención IVA", reqd: 1, "default": ret_iva},
        {"fieldname":"ret_imp","fieldtype":"Currency","label":__("Valor Impuesto Fuente"),
          label:"Valor Retención Impuesto Fuente", reqd: 1, "default": ret_imp},
        {"fieldname":"section_break","fieldtype":"Section Break"},
          // {"fieldname":"table_impuestos","fieldtype":"Table",label:"Impuestos"},
        {"fieldname":"blank_data","fieldtype":"Read Only"},
        {"fieldname":"coulmn_break_1","fieldtype":"Column Break"},
        {"fieldname":"base_imponible","fieldtype":"Currency","label":__("Base Imponible"),
          label:"Valor Base Imponible", reqd: 1, "default": frm.doc.base_imponible},
        {"fieldname":"impuesto","fieldtype":"Currency","label":__("Impuesto"),
          label:"Valor Impuesto", reqd: 1, "default": frm.doc.impuesto},
        {"fieldname":"total_retencion","fieldtype":"Currency","label":__("Total Retención"),
          label:"Total Retención", reqd: 1, "default": total_ret},
        {"fieldname":"section_break_2","fieldtype":"Section Break"},
				//{fieldname:"confirm", "label":__("Confirm"), "fieldtype":"Button"},
        // {"fieldname":"coulmn_break_2","fieldtype":"Column Break"},
         {fieldname:"confirm", "label":__("Confirm"), "fieldtype":"Button"}]
		});
    d.get_input("iva").on("click",function(){
      alert("AQUI");
    });
		d.get_input("confirm").on("click", function() {
			var values = d.get_values();
			if(!values) return;
			if(values["referencia"] == "001-001-" ) frappe.throw("Ingrese el número de referencia de la orden de compra");
      if(values["proveedor"] != frm.doc.supplier ) frappe.throw("No coinciden los datos del nombre del proveedor");
			if(values["base_imponible"] != frm.doc.base_imponible) frappe.throw("El valor de base imponible debe ser el mismo que el de la orden de compra");
      if(values["impuesto"] != frm.doc.impuesto) frappe.throw("El valor de impuestos debe ser el mismo que el de la orden de compra");
      var suma = values["ret_iva"] + values["ret_imp"];
      if(suma != total_ret) frappe.throw("No coincide el valor de las retenciones... verifique nuevamente");
      // return frappe.call({
			// 	doc: frm.doc,
			// 	method: "nodux_sales_invoice.purchase_invoice.update_taxes",
			// 	// args: values,
      //   args: {
      //     iva 	: sup_iva
      //   },
			// 	freeze: true,
			// 	callback: function(r) {
			// 		// var row = frm.add_child("payments");
			// 		// row.amount = values["total"];
			// 		// row.date = frappe.datetime.nowdate();
      //     if(r.message) {
      //
      //       d.hide();
  		// 			frm.refresh_fields();
  		// 			frm.refresh();
      //     }
			// 	}
			// })
		});
		d.show();
		frm.refresh_fields();
		frm.refresh();
  }

});
