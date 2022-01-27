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
