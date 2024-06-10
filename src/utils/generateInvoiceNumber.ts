const generateInvoiceNumber = () => {
  // Generate a random 6-digit number
  const randomNumber = Math.floor(100000 + Math.random() * 900000);

  // Return the formatted invoice number with the prefix "INV-"
  return `INV-${randomNumber}`;
};

export default generateInvoiceNumber;
