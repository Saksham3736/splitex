export type Id = string;

export type SplitType = "equal" | "exact" | "percentage";

export type User = {
  id: Id;
  name: string;
  email?: string;
  upi_id?: string | null;
  profile_image?: string | null;
};

export type GroupMember = {
  id?: Id;
  user_id: Id;
  role?: "member" | "admin";
  status?: "active" | "inactive";
  user?: User;
};

export type Group = {
  id: Id;
  name: string;
  description?: string | null;
  created_by?: Id;
  group_type?: string | null;
  members?: GroupMember[];
  created_at?: string;
};

export type ExpenseParticipant = {
  user_id: Id;
  share_amount?: number;
  share_percentage?: number;
  share_units?: number;
  is_included?: boolean;
  user?: User;
};

export type Expense = {
  id: Id;
  group_id: Id;
  paid_by: Id;
  description?: string | null;
  amount: number;
  currency?: string;
  split_type: SplitType;
  category?: string | null;
  expense_date?: string | null;
  created_by?: Id;
  created_at?: string;
  participants?: ExpenseParticipant[];
};

export type Balance = {
  id?: Id;
  group_id: Id;
  from_user_id: Id;
  to_user_id: Id;
  amount: number;
  updated_at?: string;
  from_user?: User;
  to_user?: User;
};

export type NetBalances = Record<Id, number>;

export type SettlementPlanItem = {
  from: Id;
  to: Id;
  amount: number;
};

export type Settlement = {
  id: Id;
  group_id: Id;
  payer_id: Id;
  receiver_id: Id;
  amount: number;
  payment_method?: string | null;
  payment_status?: "pending" | "completed";
  transaction_ref?: string | null;
  settled_at?: string | null;
  created_at?: string;
};

export type Notification = {
  id: Id;
  user_id: Id;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
};

export type UpiLinkResponse = {
  upiLink: string;
};

