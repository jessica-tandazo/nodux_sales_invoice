//{% include 'nodux_sales_invoice/delivery_note/delivery_note.py' %};
frappe.ui.form.on('Delivery Note', {
	onload: function(frm){
    msgprint("ingreso");
	}
	// refresh: function(frm) {
	//
	// },
	// customer: function(frm){
	// 	if (frm.doc.customer) {
	// 		 var resp = frappe.db.get_value("Pricing Rule", {"definir_como_precio_de_venta": 1}, "title", function(r) {
  //         if (resp!=null) {
  //           frm.set_value("pricing_rule", r.title);
  //           refresh_field(["pricing_rule"]);
  //         } else {
  //           msgprint("No hay un valor definido de regla de precios... debe definir primero un valor en la regla de precios")
  //         }
  //       refresh_field(["pricing_rule"]);
  //     })
	// 	}
	// 	frm.refresh_fields();
	// }
})
// frappe.ui.form.on('Delivery Note Item', {
//   item_code_1: function(frm, cdt, cdn){
//     var d = locals[cdt][cdn];
// 		// var base_imponible = 0;
// 		// var total_taxes = 0;
// 		// var total = 0;
//
// 		if(d.item_code_1) {
// 			args = {
// 				// 'item_code'			: d.item_code,
// 				// 'qty'				: d.qty
// 				'item_code'			: d.item_code_1
// 			};
// 			return frappe.call({
// 				doc: cur_frm.doc,
// 				method: "get_item_code_sale",
// 				args: args,
// 				callback: function(r) {
// 					if(r.message) {
// 						var d = locals[cdt][cdn];
// 						$.each(r.message, function(k, v) {
// 							d[k] = v;
// 						});
// 						refresh_field("items");
// 						cur_frm.refresh_fields();
// 					}
//
// 				}
// 			});
// 			frm.refresh_fields();
// 		}
//   }
// })
