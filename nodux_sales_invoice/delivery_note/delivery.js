frappe.ui.form.on('Delivery Note', {
  onload: function(frm){
    msgprint("INGRESO");
  },
  customer: function(frm){
  	if (frm.doc.customer) {
  		 var resp = frappe.db.get_value("Pricing Rule", {"definir_como_precio_de_venta": 1}, "title", function(r) {
          if (resp!=null) {
            frm.set_value("pricing_rule", r.title);
            refresh_field(["pricing_rule"]);
          } else {
            msgprint("No hay un valor definido de regla de precios... debe definir primero un valor en la regla de precios")
          }
        refresh_field(["pricing_rule"]);
      })
  	}
  	frm.refresh_fields();
  },
  formas_de_pago_sri: function(frm){
    if(frm.doc.formas_de_pago_sri){
      //msgprint("FORMA DE PAGO");
      return frappe.call({
         method: "nodux_sales_invoice.delivery_note.get_it",
         args: {
           salary: frm.doc.pricing_rule,
         },
         callback: function(r) {
           if (r.message) {
               alert("done");
           }
         }
       });

    }

  }
});

frappe.ui.form.on('Delivery Note Item',{
  item_code_1: function(frm, cdt, cdn){
    var d = locals[cdt][cdn];
    msgprint("valor de d: " + d.item_code_1);
    if (d.item_code_1) {
      // args = {
      //   'item_code'			 : d.item_code_1
			// 	//'qty'				     : d.qty
			// };
      return frappe.call({
				method: "nodux_sales_invoice.delivery_note.get_item_code_sale",
				//args: args,
        args: {
          item_code 	: d.item_code_1
        },
				callback: function(r) {
					if(r.message) {
						var d = locals[cdt][cdn];
						$.each(r.message, function(k, v) {
							d[k] = v;
						});
						refresh_field("items");
						frm.refresh_fields();
            calculate_base_imponible(frm);
					}

				}
			});
      frm.refresh_fields();
    }
  },
  qty: function(frm, cdt, cdn) {
		var a = locals[cdt][cdn];
		if(a.qty) {
      var unit_price = 0;
      var qty = 0;
      var subtotal = 0;

      unit_price = a.unit_price;
      qty = a.qty;
      subtotal = unit_price * qty;
      a.subtotal = subtotal;

      refresh_field("items");
			cur_frm.refresh_fields();
      calculate_base_imponible(frm);
		}
	},
  // discount: function(frm, cdt, cdn){
  //   var a = locals[cdt][cdn];
  //   if (a.discount) {
  //     var discount = 0;
  //     var p_unit = 0;
  //     var new_p_unit = 0;
  //     var subtotal = 0;
  //
  //     discount = a.discount;
  //     p_unit = (a.unit_price) * (discount / 100);
  //     new_p_unit = a.unit_price_with_no_dcto - p_unit;
  //     a.unit_price = new_p_unit;
  //     subtotal = a.qty * new_p_unit;
  //     a.subtotal = subtotal;
  //     refresh_field("items");
	// 		cur_frm.refresh_fields();
  //     calculate_base_imponible(frm);
  //
  //   }
  // }
})
var calculate_base_imponible = function(frm) {
	var doc = frm.doc;
	doc.base_imponible = 0;
	doc.total_taxes = 0;
	doc.total = 0;

	if(doc.items) {
		$.each(doc.items, function(index, data){
			doc.base_imponible += (data.unit_price * data.qty);
			// doc.total_taxes += (data.unit_price_with_tax - data.unit_price) * data.qty;
		})
		// doc.total += doc.base_imponible + doc.total_taxes;
	}
	refresh_field('base_imponible')
	refresh_field('total_taxes')
	refresh_field('total')
}

// frappe.ui.form.on('Table Delivery',{
//   item_code_a: function(frm, cdt, cdn){
//     var a = locals[cdt][cdn];
//     if (a.item_code_a) {
//       // args = {
// 			// 	'item_code'			 : a.item_code_a
// 			// };
//       //alert("VALOR: " + args);
//       return frappe.call({
//         method: "nodux_sales_invoice.delivery_note.get_item_code_sale",
//         args: {
//           item_code 	: a.item_code_a
//         },
//         // args: args,
//         // args = {
//         //   'item_code'			 : item,
//         // },
//         callback: function(r) {
// 					if(r.message) {
// 						var d = locals[cdt][cdn];
// 						$.each(r.message, function(k, v) {
// 							d[k] = v;
// 						});
// 						refresh_field("deleivery_items");
// 						//cur_frm.refresh_fields();
//             frm.refresh_fields();
// 					}
// 				}
//       });
//     }
//   }
//
//
// })
