export const formatNumber = (value: number | string, locale: string = 'id-ID', currency: string = 'IDR'): string => {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }

  if (currency) {
    options.style = 'currency'
    options.currency = currency
  }

  return new Intl.NumberFormat(locale, options).format(Number(value))
}
