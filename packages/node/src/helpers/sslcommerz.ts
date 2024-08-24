import { checkoutParams } from "../types/sslcommerz";

async function paymentInitDataProcess(params: checkoutParams) {
  let postData: checkoutParams = {
    /*  Integration Required Parameters */
    //required//
    store_id: params.store_id,
    store_passwd: params.store_passwd,
    product_category: params.product_category,
    tran_id: params.tran_id,
    total_amount: params.total_amount,
    currency: params.currency,
    success_url: params.success_url,
    fail_url: params.fail_url,
    cancel_url: params.cancel_url,
    //optional//
    ipn_url: params.ipn_url,
    multi_card_name: params.multi_card_name,
    allowed_bin: params.allowed_bin,

    /* Parameters to Handle EMI Transaction */
    // required//
    emi_option: params.emi_option,
    //optional//
    emi_max_inst_option: params.emi_max_inst_option,
    emi_selected_inst: params.emi_selected_inst,

    /* Customer Information */
    //required
    cus_name: params.cus_name,
    cus_email: params.cus_email,
    cus_add1: params.cus_add1,
    cus_add2: params.cus_add2,
    cus_city: params.cus_city,
    cus_state: params.cus_state,
    cus_postcode: params.cus_postcode,
    cus_country: params.cus_country,
    cus_phone: params.cus_phone,
    //optional
    cus_fax: params.cus_fax,

    /* Shipment Information */
    //required
    shipping_method: params.shipping_method,
    num_of_item: params.num_of_item,
    //optional
    ship_name: params.ship_name,
    shipcity: params.shipcity,
    ship_add1: params.ship_add1,
    ship_add2: params.ship_add2,
    ship_city: params.ship_city,
    ship_state: params.ship_state,
    ship_postcode: params.ship_postcode,
    ship_country: params.ship_country,

    /* Product Information */
    //required
    product_name: params.product_name,
    product_profile: params.product_profile,
    //optional
    hours_till_departure: params.hours_till_departure,
    flight_type: params.flight_type,
    pnr: params.pnr,
    journey_from_to: params.journey_from_to,
    third_party_booking: params.third_party_booking,
    hotel_name: params.hotel_name,
    length_of_stay: params.length_of_stay,
    check_in_time: params.check_in_time,
    hotel_city: params.hotel_city,
    product_type: params.product_type,
    topup_number: params.topup_number,
    country_topup: params.country_topup,
    cart: params.cart,
    product_amount: params.product_amount,
    discount_amount: params.discount_amount,
    convenience_fee: params.convenience_fee,
  };
  const fData = new FormData();
  for (const [key, value] of Object.entries(postData)) {
    fData.append(key, value ?? "");
  }

  return fData;
}

export { paymentInitDataProcess };
