export function formatIndianCurrency(price: number): string {
  if (price >= 10000000) {
    // Convert to Crores
    const crores = price / 10000000;
    return `₹${crores % 1 === 0 ? crores : crores.toFixed(2)} Cr`;
  } else if (price >= 100000) {
    // Convert to Lacs
    const lacs = price / 100000;
    return `₹${lacs % 1 === 0 ? lacs : lacs.toFixed(2)} L`;
  } else {
    // Standard formatting for < 1 Lac
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  }
}

export function generateWhatsAppLink(phoneNumber: string, propertyTitle: string): string {
  // Remove all non-digit characters from phone number
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const message = `Hi, I am interested in this property: ${propertyTitle}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}
