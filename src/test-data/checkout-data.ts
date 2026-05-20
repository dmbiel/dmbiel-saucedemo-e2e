export const checkoutData = {
  validCustomer: {
    firstName: 'Dmytro',
    lastName: 'Bieliaiev',
    postalCode: '00-001',
  },
  emptyFirstName: {
    firstName: '',
    lastName: 'Bieliaiev',
    postalCode: '00-001',
  },
  emptyLastName: {
    firstName: 'Dmytro',
    lastName: '',
    postalCode: '00-001',
  },
  emptyPostalCode: {
    firstName: 'Dmytro',
    lastName: 'Bieliaiev',
    postalCode: '',
  },
} as const;

export type CheckoutCustomer = (typeof checkoutData)[keyof typeof checkoutData];
