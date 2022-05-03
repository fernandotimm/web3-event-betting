const simplifyWalletAddress = (addr:string):string => {
  return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`;
}

export {
  simplifyWalletAddress,
}
