export const defaultSelect = (itemKinds, itemKindsSupport) => {
  const itemKindsDic = {};
  for (let i = 0, { length } = itemKinds; i < length; i += 1) {
    const itemKindsItem = itemKinds[i];
    const { liabilityCode } = itemKindsItem;
    itemKindsDic[liabilityCode] = itemKindsItem;
  }

  for (let i = 0, { length } = itemKindsSupport; i < length; i += 1) {
    const itemKindsSupportItem = itemKindsSupport[i];
    const { liabilityCode } = itemKindsSupportItem;
    const itemKindsItem = itemKindsDic[liabilityCode];
    if (!itemKindsItem) {
      const { insuredAmounts } = itemKindsSupportItem;
      if (insuredAmounts.length > 0) {
        const {
          insuredAmount,
          amountUnit,
          insuredAmountText,
        } = insuredAmounts[0];
        itemKinds.push({
          liabilityName: itemKindsSupportItem.liabilityName,
          liabilityTypeCode: itemKindsSupportItem.liabilityTypeCode,
          liabilityInsCode: itemKindsSupportItem.liabilityInsCode,
          liabilityAbstract: itemKindsSupportItem.liabilityAbstract,
          liabilityDescribe: itemKindsSupportItem.liabilityDescribe,
          liabilityCode: itemKindsSupportItem.liabilityCode,
          insuredAmount,
          amountUnit,
          insuredAmountText,
        });
      }
    }
  }
};
