export type TableSeq = {
  last_value: number;
  is_called: boolean;
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
