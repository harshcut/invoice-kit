export type TableSeq = {
  last_value: number;
  is_called: boolean;
};

export type InvoiceSeq = {
  invoice_id?: string;
};

export type ServiceMst = {
  service_id: number;
  sac: number;
  description: string;
  cgst: number;
  sgst: number;
  igst: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type NewService = {
  service_id?: number;
  sac: number;
  description: string;
  cgst: number;
  sgst: number;
  igst: number;
  active: boolean;
};

export type CustomerMst = {
  customer_id: number;
  gstin: string;
  name: string;
  address: string;
  payment_terms?: string;
  services?: number[];
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type NewCustomer = {
  customer_id?: number;
  gstin: string;
  name: string;
  address: string;
  payment_terms?: string;
  services?: number[];
  active?: boolean;
};

export type InvoiceMst = {
  invoice_id: string;
  date: string;
  customer_id: number;
  customer_data: CustomerMst;
  payment_terms: string;
  particulars: {
    text: string;
    amount?: number;
    service_data?: ServiceMst;
  }[];
  total_amount: number;
  created_at: string;
};

export type NewInvoice = {
  invoice_id: string;
  date: Date;
  customer_id: number;
  payment_terms: string;
  particulars: {
    optional?: string;
    amount: string;
  }[];
  total_amount: number;
};

export type OwnerMst = {
  owner_id: number;
  name: string;
  address: string;
  phone: string;
  gstin: string;
  optional?: {
    key: string;
    value: string;
  }[];
  payment_details?: {
    key: string;
    value: string;
  }[];
  updated_at: string;
};

export type NewOwner = {
  name: string;
  address: string;
  phone: string;
  gstin: string;
  optional?: {
    key: string;
    value: string;
  }[];
  payment_details?: {
    key: string;
    value: string;
  }[];
};
