export type SavedClientPayload = {
  firstName: string;
  lastName: string;
  email: string;
  address: {
    number: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  phone: string;
  mobile: string;
};

export type SavedClient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: {
    number: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  phone: string;
  mobile: string;
  belongsTo: string;
  createdAt: Date;
  updatedAt: Date;
};
