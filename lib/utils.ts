export const shortenAddress = (address: string, chars = 4) => {
  return `${address.slice(0, chars + 2)}...${address.slice(42 - chars)}`
}

export const formatDollars = (amount: number | string) => {
  return `$ ${Number(amount).toFixed(2)}`
}
