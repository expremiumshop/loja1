export function formatPrice(price:number){

    return new Intl.NumberFormat(
      "pt-MZ",
      {
        style:"currency",
        currency:"MZN",
      }
    ).format(price)
  
  }